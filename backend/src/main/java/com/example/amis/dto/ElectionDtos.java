package com.example.amis.dto;

import java.time.LocalDateTime;
import java.util.List;

public final class ElectionDtos {
    private ElectionDtos() {
    }

    public record CandidateView(Long id, String name, String manifesto, long votes, double percentage, boolean voted) {
    }

    public record PositionView(Long id, String name, int displayOrder, List<CandidateView> candidates, boolean voted) {
    }

    public record ElectionView(Long id, String title, String description, LocalDateTime startsAt, LocalDateTime endsAt,
                               boolean active, boolean closed, List<PositionView> positions) {
    }

    public record ResultView(Long electionId, String title, List<PositionResult> positions) {
    }

    public record PositionResult(String position, long totalVotes, CandidateView winner, List<CandidateView> candidates) {
    }
}
