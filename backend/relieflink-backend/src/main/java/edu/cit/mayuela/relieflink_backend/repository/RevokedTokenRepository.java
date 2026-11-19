package edu.cit.mayuela.relieflink_backend.repository;

import edu.cit.mayuela.relieflink_backend.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {}