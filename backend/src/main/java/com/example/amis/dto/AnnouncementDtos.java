package com.example.amis.dto;

import java.time.LocalDateTime;

public final class AnnouncementDtos {
    private AnnouncementDtos() {
    }

    public record AnnouncementView(Long id, String title, String content, String category, String priority,
                                   String attachmentUrl, String targetYear, String targetProgramme, String targetCourse,
                                   LocalDateTime publishAt, LocalDateTime expiresAt, boolean published,
                                   String authorUsername, LocalDateTime createdAt) {
    }
}
