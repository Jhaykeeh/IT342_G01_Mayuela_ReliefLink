package edu.cit.mayuela.relieflink_backend.service;

import edu.cit.mayuela.relieflink_backend.dto.*;
import edu.cit.mayuela.relieflink_backend.model.*;
import edu.cit.mayuela.relieflink_backend.repository.*;
import edu.cit.mayuela.relieflink_backend.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RevokedTokenRepository revokedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public UserResponse register(RegisterRequest req) {
        if (req.role() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role for registration");
        }
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        User user = userRepository.save(User.builder()
                .fullName(req.fullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(req.role())
                .contactNumber(req.contactNumber() == null || req.contactNumber().isBlank() ? null : req.contactNumber().trim())
                .build());
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email().trim().toLowerCase())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return new AuthResponse(jwtService.generateToken(user), user.getId(),
                user.getFullName(), user.getEmail(), user.getRole());
    }

    public void logout(String token) {
        Claims claims = jwtService.parse(token);
        if (!revokedTokenRepository.existsById(claims.getId())) {
            revokedTokenRepository.save(new RevokedToken(claims.getId(), claims.getExpiration().toInstant()));
        }
    }

    public UserResponse getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole(),
                u.getContactNumber(), u.getCreatedAt());
    }
}