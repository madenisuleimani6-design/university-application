package com.example.amis.dto;

import java.time.LocalDateTime;

public final class ElectionRequests {
    private ElectionRequests() {
    }

    public record CreateElection(String title, String description, LocalDateTime startsAt, LocalDateTime endsAt) {
    }

    public record CreatePosition(String name, int displayOrder) {
    }

    public record CreateCandidate(String name, String manifesto) {
    }

    public record CastVote(Long candidateId) {
    }
}
