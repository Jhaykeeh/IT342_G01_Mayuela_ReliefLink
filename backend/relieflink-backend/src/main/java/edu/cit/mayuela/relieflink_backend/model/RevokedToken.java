package edu.cit.mayuela.relieflink_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "revoked_tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RevokedToken {
    @Id @Column(length = 64)
    private String jti;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
}