package com.example.amis.service;

import com.example.amis.dto.ElectionDtos;
import com.example.amis.dto.ElectionRequests;
import com.example.amis.entity.Candidate;
import com.example.amis.entity.Election;
import com.example.amis.entity.ElectionPosition;
import com.example.amis.entity.User;
import com.example.amis.entity.Vote;
import com.example.amis.repository.CandidateRepository;
import com.example.amis.repository.ElectionPositionRepository;
import com.example.amis.repository.ElectionRepository;
import com.example.amis.repository.UserRepository;
import com.example.amis.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ElectionService {
    private final ElectionRepository electionRepository;
    private final ElectionPositionRepository positionRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;

    public ElectionService(ElectionRepository electionRepository,
                           ElectionPositionRepository positionRepository,
                           CandidateRepository candidateRepository,
                           VoteRepository voteRepository,
                           UserRepository userRepository) {
        this.electionRepository = electionRepository;
        this.positionRepository = positionRepository;
        this.candidateRepository = candidateRepository;
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ElectionDtos.ElectionView> list(String username) {
        User voter = findUser(username);
        return electionRepository.findAllByOrderByStartsAtDesc().stream()
                .map(election -> toView(election, voter.getId()))
                .toList();
    }

    @Transactional
    public ElectionDtos.ElectionView create(ElectionRequests.CreateElection request) {
        validateDates(request.startsAt(), request.endsAt());
        Election election = new Election();
        election.setTitle(required(request.title(), "Title"));
        election.setDescription(request.description());
        election.setStartsAt(request.startsAt());
        election.setEndsAt(request.endsAt());
        election.setActive(false);
        election.setClosed(false);
        return toView(electionRepository.save(election), null);
    }

    @Transactional
    public ElectionDtos.PositionView addPosition(Long electionId, ElectionRequests.CreatePosition request) {
        Election election = findElection(electionId);
        if (election.isClosed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A closed election cannot be changed");
        }
        ElectionPosition position = new ElectionPosition();
        position.setElection(election);
        position.setName(required(request.name(), "Position name"));
        position.setDisplayOrder(request.displayOrder());
        return toPositionView(positionRepository.save(position), null, Map.of());
    }

    @Transactional
    public ElectionDtos.CandidateView addCandidate(Long positionId, ElectionRequests.CreateCandidate request) {
        ElectionPosition position = findPosition(positionId);
        if (position.getElection().isClosed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A closed election cannot be changed");
        }
        Candidate candidate = new Candidate();
        candidate.setPosition(position);
        candidate.setName(required(request.name(), "Candidate name"));
        candidate.setManifesto(request.manifesto());
        return toCandidateView(candidateRepository.save(candidate), Map.of(), Set.of());
    }

    @Transactional
    public ElectionDtos.ElectionView setStatus(Long electionId, boolean active, boolean closed) {
        Election election = findElection(electionId);
        if (closed) {
            election.setClosed(true);
            election.setActive(false);
        } else {
            election.setActive(active);
        }
        return toView(electionRepository.save(election), null);
    }

    @Transactional
    public void vote(Long electionId, ElectionRequests.CastVote request, String username) {
        if (request == null || request.candidateId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A candidate must be selected");
        }
        Election election = findElection(electionId);
        LocalDateTime now = LocalDateTime.now();
        if (!election.isActive() || election.isClosed() || now.isBefore(election.getStartsAt()) || now.isAfter(election.getEndsAt())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This election is not currently accepting votes");
        }

        User voter = findUser(username);
        Candidate candidate = candidateRepository.findById(request.candidateId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found"));
        ElectionPosition position = candidate.getPosition();
        if (!Objects.equals(position.getElection().getId(), electionId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Candidate does not belong to this election");
        }
        if (voteRepository.existsByVoterIdAndPositionId(voter.getId(), position.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already voted for this position");
        }

        Vote vote = new Vote();
        vote.setVoter(voter);
        vote.setElection(election);
        vote.setPosition(position);
        vote.setCandidate(candidate);
        vote.setVotedAt(now);
        voteRepository.save(vote);
    }

    @Transactional(readOnly = true)
    public ElectionDtos.ResultView results(Long electionId) {
        Election election = findElection(electionId);
        List<Vote> votes = voteRepository.findByElectionId(electionId);
        Map<Long, Long> counts = votes.stream().collect(Collectors.groupingBy(vote -> vote.getCandidate().getId(), Collectors.counting()));
        List<ElectionDtos.PositionResult> positions = election.getPositions().stream()
                .map(position -> {
                    List<ElectionDtos.CandidateView> candidates = position.getCandidates().stream()
                            .map(candidate -> toCandidateView(candidate, counts, Set.of()))
                            .sorted((a, b) -> Long.compare(b.votes(), a.votes()))
                            .toList();
                    long total = candidates.stream().mapToLong(ElectionDtos.CandidateView::votes).sum();
                    List<ElectionDtos.CandidateView> withPercentages = candidates.stream()
                            .map(candidate -> new ElectionDtos.CandidateView(candidate.id(), candidate.name(), candidate.manifesto(),
                                    candidate.votes(), total == 0 ? 0 : candidate.votes() * 100.0 / total, false))
                            .toList();
                    return new ElectionDtos.PositionResult(position.getName(), total, withPercentages.isEmpty() ? null : withPercentages.get(0), withPercentages);
                }).toList();
        return new ElectionDtos.ResultView(election.getId(), election.getTitle(), positions);
    }

    private ElectionDtos.ElectionView toView(Election election, Long voterId) {
        Set<Long> votedPositions = voterId == null ? Set.of() : voteRepository.findByElectionId(election.getId()).stream()
                .filter(vote -> Objects.equals(vote.getVoter().getId(), voterId))
                .map(vote -> vote.getPosition().getId())
                .collect(Collectors.toSet());
        return new ElectionDtos.ElectionView(election.getId(), election.getTitle(), election.getDescription(), election.getStartsAt(), election.getEndsAt(),
                election.isActive(), election.isClosed(), election.getPositions().stream()
                .map(position -> toPositionView(position, voterId, Map.of(), votedPositions)).toList());
    }

    private ElectionDtos.PositionView toPositionView(ElectionPosition position, Long voterId, Map<Long, Long> counts) {
        return toPositionView(position, voterId, counts, Set.of());
    }

    private ElectionDtos.PositionView toPositionView(ElectionPosition position, Long voterId, Map<Long, Long> counts, Set<Long> votedPositions) {
        return new ElectionDtos.PositionView(position.getId(), position.getName(), position.getDisplayOrder(),
                position.getCandidates().stream().map(candidate -> toCandidateView(candidate, counts, votedPositions)).toList(),
                votedPositions.contains(position.getId()));
    }

    private ElectionDtos.CandidateView toCandidateView(Candidate candidate, Map<Long, Long> counts, Set<Long> votedPositions) {
        return new ElectionDtos.CandidateView(candidate.getId(), candidate.getName(), candidate.getManifesto(), counts.getOrDefault(candidate.getId(), 0L), 0, false);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Election findElection(Long id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Election not found"));
    }

    private ElectionPosition findPosition(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Position not found"));
    }

    private String required(String value, String label) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + " is required");
        }
        return value.trim();
    }

    private void validateDates(LocalDateTime startsAt, LocalDateTime endsAt) {
        if (startsAt == null || endsAt == null || !endsAt.isAfter(startsAt)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Election end time must be after its start time");
        }
    }
}
