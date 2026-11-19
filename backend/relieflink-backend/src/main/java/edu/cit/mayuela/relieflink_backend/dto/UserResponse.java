package edu.cit.mayuela.relieflink_backend.dto;

import edu.cit.mayuela.relieflink_backend.model.Role;
import java.time.LocalDateTime;

public record UserResponse(Long id, String fullName, String email, Role role, String contactNumber, LocalDateTime createdAt) {


}