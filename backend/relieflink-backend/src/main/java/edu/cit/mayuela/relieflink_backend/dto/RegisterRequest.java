package edu.cit.mayuela.relieflink_backend.dto;

import edu.cit.mayuela.relieflink_backend.model.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Full name is required") @Size(max = 100) String fullName,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") @Size(max = 150) String email,
        @NotBlank(message = "Password is required") @Size(min = 8, max = 72, message = "Password must be 8-72 characters") String password,
        @NotNull(message = "Role is required") Role role,
        @Pattern(regexp = "^$|^[0-9+\\-\\s]{7,20}$", message = "Invalid contact number") String contactNumber
) {}