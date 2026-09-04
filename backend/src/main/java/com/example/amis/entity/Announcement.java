package com.example.amis.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Data
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 6000)
    private String content;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String priority = "NORMAL";

    private String attachmentUrl;
    private String targetYear;
    private String targetProgramme;
    private String targetCourse;
    private LocalDateTime publishAt;
    private LocalDateTime expiresAt;
    private boolean published;
    private String authorUsername;
    private LocalDateTime createdAt;
}
