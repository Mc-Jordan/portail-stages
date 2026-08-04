package com.university.internship.dto;

import com.university.internship.model.ApplicationStatus;

import java.time.LocalDateTime;

public class ApplicationDTO {
    
    private Long id;
    private Long internshipOfferId;
    private String offerTitle;
    private String companyName;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String cvUrl;
    private String coverLetter;
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
    private String feedback;
    
    // Student profile information
    private String fieldOfStudy;
    private String university;
    private Integer expectedGraduationYear;
    
    // Constructors
    public ApplicationDTO() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getInternshipOfferId() {
        return internshipOfferId;
    }
    
    public void setInternshipOfferId(Long internshipOfferId) {
        this.internshipOfferId = internshipOfferId;
    }
    
    public String getOfferTitle() {
        return offerTitle;
    }
    
    public void setOfferTitle(String offerTitle) {
        this.offerTitle = offerTitle;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getStudentEmail() {
        return studentEmail;
    }
    
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }
    
    public String getCvUrl() {
        return cvUrl;
    }
    
    public void setCvUrl(String cvUrl) {
        this.cvUrl = cvUrl;
    }
    
    public String getCoverLetter() {
        return coverLetter;
    }
    
    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
    
    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }
    
    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }
    
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
    
    public String getFieldOfStudy() {
        return fieldOfStudy;
    }
    
    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }
    
    public String getUniversity() {
        return university;
    }
    
    public void setUniversity(String university) {
        this.university = university;
    }
    
    public Integer getExpectedGraduationYear() {
        return expectedGraduationYear;
    }
    
    public void setExpectedGraduationYear(Integer expectedGraduationYear) {
        this.expectedGraduationYear = expectedGraduationYear;
    }
}
