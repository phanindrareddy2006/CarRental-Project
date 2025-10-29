package com.example.carrental.repository;

import com.example.carrental.model.Role;
import com.example.carrental.model.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}

