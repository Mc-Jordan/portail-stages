package com.university.internship.dto;

import jakarta.validation.constraints.NotBlank;

public class ApplicationRequest {
    
    @NotBlank
    private String coverLetter;
    
    // Constructors
    public ApplicationRequest() {}
    
    public ApplicationRequest(String coverLetter) {
        this.coverLetter = coverLetter;
    }
    
    // Getters and Setters
    public String getCoverLetter() {
        return coverLetter;
    }
    
    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
