package com.example.amis.repository;

import com.example.amis.entity.ResultRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<ResultRecord, Long> {
}
