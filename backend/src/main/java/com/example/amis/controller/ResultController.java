package com.example.amis.controller;

import com.example.amis.entity.ResultRecord;
import com.example.amis.repository.ResultRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {
    private final ResultRepository repository;

    public ResultController(ResultRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ResultRecord> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResultRecord create(@RequestBody ResultRecord resultRecord) {
        return repository.save(resultRecord);
    }
}
