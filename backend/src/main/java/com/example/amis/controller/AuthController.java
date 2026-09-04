package com.example.amis.controller;

import com.example.amis.config.JwtService;
import com.example.amis.dto.AuthResponse;
import com.example.amis.dto.LoginRequest;
import com.example.amis.entity.User;
import com.example.amis.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.username());
        if (userOpt.isPresent() && passwordEncoder.matches(request.password(), userOpt.get().getPasswordHash())) {
            String token = jwtService.generateToken(userOpt.get().getUsername());
            String role = userOpt.get().getRole() == null ? "STUDENT" : userOpt.get().getRole().getRoleName();
            return ResponseEntity.ok(new AuthResponse(token, userOpt.get().getUsername(), role));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
