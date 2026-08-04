package com.university.internship.dto;

import com.university.internship.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateApplicationStatusRequest {
    
    @NotNull
    private ApplicationStatus status;
    
    private String feedback;
    
    // Constructors
    public UpdateApplicationStatusRequest() {}
    
    public UpdateApplicationStatusRequest(ApplicationStatus status, String feedback) {
        this.status = status;
        this.feedback = feedback;
    }
    
    // Getters and Setters
    public ApplicationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
