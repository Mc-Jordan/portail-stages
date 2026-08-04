package com.university.internship.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "internship_agreements")
public class InternshipAgreement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;
    
    @ManyToOne
    @JoinColumn(name = "validating_teacher_id")
    private User validatingTeacher;
    
    private String pdfUrl;
    
    @NotNull
    @Column(nullable = false)
    private LocalDateTime generationDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgreementStatus status = AgreementStatus.PENDING_TEACHER_VALIDATION;
    
    @Column(columnDefinition = "TEXT")
    private String teacherComments;
    
    // Constructors
    public InternshipAgreement() {}
    
    public InternshipAgreement(Application application) {
        this.application = application;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Application getApplication() {
        return application;
    }
    
    public void setApplication(Application application) {
        this.application = application;
    }
    
    public User getValidatingTeacher() {
        return validatingTeacher;
    }
    
    public void setValidatingTeacher(User validatingTeacher) {
        this.validatingTeacher = validatingTeacher;
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
}
