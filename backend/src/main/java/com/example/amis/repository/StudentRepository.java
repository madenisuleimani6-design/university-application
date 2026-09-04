package com.example.amis.repository;

import com.example.amis.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
	Optional<Student> findByRegistrationNumber(String registrationNumber);
}
