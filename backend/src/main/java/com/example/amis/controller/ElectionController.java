package com.example.amis.controller;

import com.example.amis.dto.ElectionDtos;
import com.example.amis.dto.ElectionRequests;
import com.example.amis.service.ElectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {
    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    @GetMapping
    public List<ElectionDtos.ElectionView> list(Authentication authentication) {
        return electionService.list(authentication.getName());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ElectionDtos.ElectionView> create(@RequestBody ElectionRequests.CreateElection request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(electionService.create(request));
    }

    @PostMapping("/{electionId}/positions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ElectionDtos.PositionView> addPosition(@PathVariable Long electionId,
                                                                  @RequestBody ElectionRequests.CreatePosition request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(electionService.addPosition(electionId, request));
    }

    @PostMapping("/positions/{positionId}/candidates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ElectionDtos.CandidateView> addCandidate(@PathVariable Long positionId,
                                                                    @RequestBody ElectionRequests.CreateCandidate request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(electionService.addCandidate(positionId, request));
    }

    @PatchMapping("/{electionId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ElectionDtos.ElectionView setStatus(@PathVariable Long electionId, @RequestBody StatusRequest request) {
        return electionService.setStatus(electionId, request.active(), request.closed());
    }

    @PostMapping("/{electionId}/votes")
    public ResponseEntity<Void> vote(@PathVariable Long electionId,
                                     @RequestBody ElectionRequests.CastVote request,
                                     Authentication authentication) {
        electionService.vote(electionId, request, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{electionId}/results")
    public ElectionDtos.ResultView results(@PathVariable Long electionId) {
        return electionService.results(electionId);
    }

    public record StatusRequest(boolean active, boolean closed) {
    }
}
