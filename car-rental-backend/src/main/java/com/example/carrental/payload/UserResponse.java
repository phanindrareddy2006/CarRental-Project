package com.example.carrental.payload;

import com.example.carrental.model.User;
import java.util.stream.Collectors;

public class UserResponse {
    private String username;
    private String email;
    private String role;  // Single role (e.g., "ADMIN" or "CUSTOMER")

    public UserResponse(User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        // Take first role only (assuming 1 role per user)
        this.role = user.getRoles().stream()
                .map(r -> r.getName().name().replace("ROLE_", ""))
                .collect(Collectors.toList())
                .get(0);
    }

    // Getters
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
