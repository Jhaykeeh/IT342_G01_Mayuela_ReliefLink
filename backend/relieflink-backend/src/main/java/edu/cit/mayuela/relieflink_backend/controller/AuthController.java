package edu.cit.mayuela.relieflink_backend.controller;

import edu.cit.mayuela.relieflink_backend.dto.*;
import edu.cit.mayuela.relieflink_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/logout")
    public Map<String, String> logout(@RequestHeader("Authorization") String header) {
        authService.logout(header.substring(7));
        return Map.of("message", "Logged out successfully");
    }

    @GetMapping("/me")
    public UserResponse me(Authentication auth) {
        return authService.getByEmail(auth.getName());
    }
}