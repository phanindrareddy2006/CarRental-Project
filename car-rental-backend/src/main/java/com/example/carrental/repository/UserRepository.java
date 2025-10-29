package com.example.carrental.repository;

import com.example.carrental.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);            // <-- Add this line
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
