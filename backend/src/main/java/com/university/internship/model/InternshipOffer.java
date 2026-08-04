package com.university.internship.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "internship_offers")
public class InternshipOffer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "company_user_id", nullable = false)
    private User company;
    
    @NotBlank
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "offer_required_skills", joinColumns = @JoinColumn(name = "offer_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;
    
    private String domain;
    
    private String location;
    
    @NotNull
    @Column(nullable = false)
    private Integer durationInMonths;
    
    @NotNull
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status = OfferStatus.OPEN;
    
    @Column(nullable = false)
    private LocalDate createdDate = LocalDate.now();
    
    // Constructors
    public InternshipOffer() {}
    
    public InternshipOffer(User company, String title, String description, List<String> requiredSkills, 
                          String domain, String location, Integer durationInMonths, LocalDate startDate) {
        this.company = company;
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.domain = domain;
        this.location = location;
        this.durationInMonths = durationInMonths;
        this.startDate = startDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getCompany() {
        return company;
    }
    
    public void setCompany(User company) {
        this.company = company;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getRequiredSkills() {
        return requiredSkills;
    }
    
    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
    
    public String getDomain() {
        return domain;
    }
    
    public void setDomain(String domain) {
        this.domain = domain;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Integer getDurationInMonths() {
        return durationInMonths;
    }
    
    public void setDurationInMonths(Integer durationInMonths) {
        this.durationInMonths = durationInMonths;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public OfferStatus getStatus() {
        return status;
    }
    
    public void setStatus(OfferStatus status) {
        this.status = status;
    }
    
    public LocalDate getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
}
