package com.example.carrental.service;

import com.example.carrental.model.UserBooking;
import com.example.carrental.repository.UserBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserBookingService {

    private final UserBookingRepository repository;

    public UserBookingService(UserBookingRepository repository) {
        this.repository = repository;
    }

    public UserBooking createBooking(UserBooking booking) {
        return repository.save(booking);
    }

    public List<UserBooking> getBookingsByUsername(String username) {
        return repository.findByUsername(username); // ✅ use the injected instance
    }

}
