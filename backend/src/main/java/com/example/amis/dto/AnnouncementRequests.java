package com.example.amis.dto;

import java.time.LocalDateTime;

public final class AnnouncementRequests {
    private AnnouncementRequests() {
    }

    public record CreateAnnouncement(String title, String content, String category, String priority,
                                     String attachmentUrl, String targetYear, String targetProgramme,
                                     String targetCourse, LocalDateTime publishAt, LocalDateTime expiresAt,
                                     boolean published) {
    }
}
