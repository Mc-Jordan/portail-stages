package com.university.internship.dto;

import com.university.internship.model.AgreementStatus;
import jakarta.validation.constraints.NotNull;

public class ValidateAgreementRequest {
    
    @NotNull
    private AgreementStatus decision;
    
    private String comments;
    
    // Constructors
    public ValidateAgreementRequest() {}
    
    public ValidateAgreementRequest(AgreementStatus decision, String comments) {
        this.decision = decision;
        this.comments = comments;
    }
    
    // Getters and Setters
    public AgreementStatus getDecision() {
        return decision;
    }
    
    public void setDecision(AgreementStatus decision) {
        this.decision = decision;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
}
