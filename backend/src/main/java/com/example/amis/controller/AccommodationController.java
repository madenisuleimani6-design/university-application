package com.example.amis.controller;

import com.example.amis.entity.Accommodation;
import com.example.amis.repository.AccommodationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accommodation")
public class AccommodationController {
    private final AccommodationRepository repository;

    public AccommodationController(AccommodationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Accommodation> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Accommodation create(@RequestBody Accommodation accommodation) {
        return repository.save(accommodation);
    }
}
