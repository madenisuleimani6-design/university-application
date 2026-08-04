package com.example.amis.controller;

import com.example.amis.entity.Registration;
import com.example.amis.repository.RegistrationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/registration")
public class RegistrationController {
    private final RegistrationRepository repository;

    public RegistrationController(RegistrationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Registration> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Registration create(@RequestBody Registration registration) {
        return repository.save(registration);
    }
}
