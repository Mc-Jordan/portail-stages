package com.university.internship.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "internship_offer_id", nullable = false)
    private InternshipOffer internshipOffer;
    
    @ManyToOne
    @JoinColumn(name = "student_user_id", nullable = false)
    private User student;
    
    private String cvUrl;
    
    @Column(columnDefinition = "TEXT")
    private String coverLetter;
    
    @NotNull
    @Column(nullable = false)
    private LocalDateTime applicationDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private InternshipAgreement internshipAgreement;
    
    // Constructors
    public Application() {}
    
    public Application(InternshipOffer internshipOffer, User student, String cvUrl, String coverLetter) {
        this.internshipOffer = internshipOffer;
        this.student = student;
        this.cvUrl = cvUrl;
        this.coverLetter = coverLetter;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public InternshipOffer getInternshipOffer() {
        return internshipOffer;
    }
    
    public void setInternshipOffer(InternshipOffer internshipOffer) {
        this.internshipOffer = internshipOffer;
    }
    
    public User getStudent() {
        return student;
    }
    
    public void setStudent(User student) {
        this.student = student;
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
    
    public InternshipAgreement getInternshipAgreement() {
        return internshipAgreement;
    }
    
    public void setInternshipAgreement(InternshipAgreement internshipAgreement) {
        this.internshipAgreement = internshipAgreement;
    }
}
