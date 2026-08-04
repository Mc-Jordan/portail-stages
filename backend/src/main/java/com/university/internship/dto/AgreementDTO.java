package com.university.internship.dto;

import com.university.internship.model.AgreementStatus;

import java.time.LocalDateTime;

public class AgreementDTO {
    
    private Long id;
    private Long applicationId;
    private String studentName;
    private String studentEmail;
    private String companyName;
    private String offerTitle;
    private String pdfUrl;
    private LocalDateTime generationDate;
    private AgreementStatus status;
    private String teacherComments;
    private Long validatingTeacherId;
    private String validatingTeacherName;
    
    // Student details
    private String fieldOfStudy;
    private String university;
    private Integer expectedGraduationYear;
    
    // Constructors
    public AgreementDTO() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getApplicationId() {
        return applicationId;
    }
    
    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
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
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getOfferTitle() {
        return offerTitle;
    }
    
    public void setOfferTitle(String offerTitle) {
        this.offerTitle = offerTitle;
    }
    
    public String getPdfUrl() {
        return pdfUrl;
    }
    
    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }
    
    public LocalDateTime getGenerationDate() {
        return generationDate;
    }
    
    public void setGenerationDate(LocalDateTime generationDate) {
        this.generationDate = generationDate;
    }
    
    public AgreementStatus getStatus() {
        return status;
    }
    
    public void setStatus(AgreementStatus status) {
        this.status = status;
    }
    
    public String getTeacherComments() {
        return teacherComments;
    }
    
    public void setTeacherComments(String teacherComments) {
        this.teacherComments = teacherComments;
    }
    
    public Long getValidatingTeacherId() {
        return validatingTeacherId;
    }
    
    public void setValidatingTeacherId(Long validatingTeacherId) {
        this.validatingTeacherId = validatingTeacherId;
    }
    
    public String getValidatingTeacherName() {
        return validatingTeacherName;
    }
    
    public void setValidatingTeacherName(String validatingTeacherName) {
        this.validatingTeacherName = validatingTeacherName;
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
