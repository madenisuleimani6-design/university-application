package com.example.amis.configuration;

import com.example.amis.entity.Role;
import com.example.amis.entity.User;
import com.example.amis.repository.RoleRepository;
import com.example.amis.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DemoDataInitializer {
    @Bean
    CommandLineRunner initializeDemoUsers(RoleRepository roleRepository,
                                           UserRepository userRepository,
                                           PasswordEncoder passwordEncoder) {
        return args -> initialize(roleRepository, userRepository, passwordEncoder);
    }

    @Transactional
    void initialize(RoleRepository roleRepository,
                    UserRepository userRepository,
                    PasswordEncoder passwordEncoder) {
        Role adminRole = roleRepository.findByRoleName("ADMIN").orElseGet(() -> createRole(roleRepository, "ADMIN"));
        Role studentRole = roleRepository.findByRoleName("STUDENT").orElseGet(() -> createRole(roleRepository, "STUDENT"));

        ensureUser(userRepository, passwordEncoder, "admin", "admin@amis.edu", "admin123", adminRole);
        ensureUser(userRepository, passwordEncoder, "student", "student@amis.edu", "student123", studentRole);
    }

    private Role createRole(RoleRepository roleRepository, String name) {
        Role role = new Role();
        role.setRoleName(name);
        return roleRepository.save(role);
    }

    private void ensureUser(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            String username,
                            String email,
                            String password,
                            Role role) {
        User user = userRepository.findByUsername(username).orElseGet(User::new);
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setStatus("ACTIVE");
        userRepository.save(user);
    }
}
