package com.example.amis.controller;

import com.example.amis.dto.AnnouncementDtos;
import com.example.amis.dto.AnnouncementRequests;
import com.example.amis.service.AnnouncementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    @GetMapping
    public List<AnnouncementDtos.AnnouncementView> visible(Authentication authentication) {
        return service.visibleAnnouncements(authentication.getName());
    }

    @GetMapping("/manage")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_OFFICER', 'SPORTS_OFFICER')")
    public List<AnnouncementDtos.AnnouncementView> manage() {
        return service.manageAnnouncements();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_OFFICER', 'SPORTS_OFFICER')")
    public ResponseEntity<AnnouncementDtos.AnnouncementView> create(@RequestBody AnnouncementRequests.CreateAnnouncement request,
                                                                      Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, authentication.getName()));
    }

    @PatchMapping("/{id}/published")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACADEMIC_OFFICER', 'SPORTS_OFFICER')")
    public AnnouncementDtos.AnnouncementView updatePublished(@PathVariable Long id, @RequestBody PublishedRequest request) {
        return service.updatePublished(id, request.published());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    public record PublishedRequest(boolean published) {
    }
}
