package com.example.carrental.repository;

import com.example.carrental.model.UserBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserBookingRepository extends JpaRepository<UserBooking, Long> {
    // Spring Data JPA will implement this automatically
    List<UserBooking> findByUsername(String username);
    
    // Optional: case-insensitive search
    // List<UserBooking> findByUsernameIgnoreCase(String username);
}
