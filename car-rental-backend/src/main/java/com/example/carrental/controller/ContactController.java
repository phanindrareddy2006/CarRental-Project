package com.example.carrental.controller;

import com.example.carrental.model.ContactMessage;
import com.example.carrental.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactRepo;

    // Save a contact message
    @PostMapping("/submit")
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessage message) {
        contactRepo.save(message);
        return ResponseEntity.ok("Message submitted successfully");
    }

    // Optional: get all messages (for admin)
    @GetMapping("/all")
    public List<ContactMessage> getAllMessages() {
        return contactRepo.findAll();
    }
}
