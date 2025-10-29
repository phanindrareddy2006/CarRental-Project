package com.example.carrental.controller;

import com.example.carrental.model.UserBooking;
import com.example.carrental.service.UserBookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class UserBookingController {

    private final UserBookingService bookingService;

    public UserBookingController(UserBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public UserBooking createBooking(@RequestBody UserBooking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/user/{username}")
    public List<UserBooking> getUserBookings(@PathVariable String username) {
        return bookingService.getBookingsByUsername(username);
    }
}
