package com.example.amis.service;

import com.example.amis.dto.AnnouncementDtos;
import com.example.amis.dto.AnnouncementRequests;
import com.example.amis.entity.Announcement;
import com.example.amis.repository.AnnouncementRepository;
import com.example.amis.repository.StudentRepository;
import com.example.amis.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnnouncementService {
    private final AnnouncementRepository repository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public AnnouncementService(AnnouncementRepository repository, UserRepository userRepository, StudentRepository studentRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDtos.AnnouncementView> visibleAnnouncements(String username) {
        LocalDateTime now = LocalDateTime.now();
        String programme = userRepository.findByUsername(username)
                .flatMap(user -> studentRepository.findByRegistrationNumber(user.getUsername()))
                .map(student -> student.getProgramme() == null ? "" : student.getProgramme())
                .orElse("");
        return repository.findAllByOrderByPublishAtDesc().stream()
                .filter(item -> item.isPublished())
                .filter(item -> item.getPublishAt() == null || !item.getPublishAt().isAfter(now))
                .filter(item -> item.getExpiresAt() == null || item.getExpiresAt().isAfter(now))
                .filter(item -> item.getTargetProgramme() == null || item.getTargetProgramme().isBlank()
                    || item.getTargetProgramme().equalsIgnoreCase(programme))
                .map(this::toView)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDtos.AnnouncementView> manageAnnouncements() {
        return repository.findAllByOrderByPublishAtDesc().stream().map(this::toView).toList();
    }

    @Transactional
    public AnnouncementDtos.AnnouncementView create(AnnouncementRequests.CreateAnnouncement request, String author) {
        if (request == null || blank(request.title()) || blank(request.content()) || blank(request.category())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title, content, and category are required");
        }
        if (request.expiresAt() != null && request.publishAt() != null && !request.expiresAt().isAfter(request.publishAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry must be after publication time");
        }
        Announcement announcement = new Announcement();
        announcement.setTitle(request.title().trim());
        announcement.setContent(request.content().trim());
        announcement.setCategory(request.category().trim().toUpperCase());
        announcement.setPriority(blank(request.priority()) ? "NORMAL" : request.priority().trim().toUpperCase());
        announcement.setAttachmentUrl(request.attachmentUrl());
        announcement.setTargetYear(request.targetYear());
        announcement.setTargetProgramme(request.targetProgramme());
        announcement.setTargetCourse(request.targetCourse());
        announcement.setPublishAt(request.publishAt() == null ? LocalDateTime.now() : request.publishAt());
        announcement.setExpiresAt(request.expiresAt());
        announcement.setPublished(request.published());
        announcement.setAuthorUsername(author);
        announcement.setCreatedAt(LocalDateTime.now());
        return toView(repository.save(announcement));
    }

    @Transactional
    public AnnouncementDtos.AnnouncementView updatePublished(Long id, boolean published) {
        Announcement announcement = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Announcement not found"));
        announcement.setPublished(published);
        return toView(repository.save(announcement));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Announcement not found");
        }
        repository.deleteById(id);
    }

    private AnnouncementDtos.AnnouncementView toView(Announcement item) {
        return new AnnouncementDtos.AnnouncementView(item.getId(), item.getTitle(), item.getContent(), item.getCategory(),
                item.getPriority(), item.getAttachmentUrl(), item.getTargetYear(), item.getTargetProgramme(),
                item.getTargetCourse(), item.getPublishAt(), item.getExpiresAt(), item.isPublished(),
                item.getAuthorUsername(), item.getCreatedAt());
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}
