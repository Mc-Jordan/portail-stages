package com.university.internship.dto;

import java.time.LocalDateTime;

public class NotificationMessage {
    
    private String type;
    private String message;
    private String link;
    private LocalDateTime timestamp;
    
    // Constructors
    public NotificationMessage() {
        this.timestamp = LocalDateTime.now();
    }
    
    public NotificationMessage(String type, String message, String link) {
        this.type = type;
        this.message = message;
        this.link = link;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getLink() {
        return link;
    }
    
    public void setLink(String link) {
        this.link = link;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
