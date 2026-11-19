package edu.cit.mayuela.relieflink_backend.dto;

import edu.cit.mayuela.relieflink_backend.model.Role;

public record AuthResponse(String token, Long userId, String fullName, String email, Role role) {}