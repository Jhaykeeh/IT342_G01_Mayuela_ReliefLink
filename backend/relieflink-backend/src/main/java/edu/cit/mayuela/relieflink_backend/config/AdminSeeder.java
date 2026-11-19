package edu.cit.mayuela.relieflink_backend.config;

import edu.cit.mayuela.relieflink_backend.model.Role;
import edu.cit.mayuela.relieflink_backend.model.User;
import edu.cit.mayuela.relieflink_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {
    @Bean
    CommandLineRunner seedAdmin(UserRepository repo, PasswordEncoder encoder,
                                @Value("${app.admin.name}") String name,
                                @Value("${app.admin.email}") String email,
                                @Value("${app.admin.password}") String password) {
        return args -> {
            String normalized = email.trim().toLowerCase();
            if (!repo.existsByEmail(normalized)) {
                repo.save(User.builder()
                        .fullName(name).email(normalized)
                        .passwordHash(encoder.encode(password))
                        .role(Role.ADMIN).build());
            }
        };
    }
}