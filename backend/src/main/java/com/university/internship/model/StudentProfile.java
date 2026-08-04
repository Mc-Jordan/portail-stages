package com.university.internship.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank
    @Column(nullable = false)
    private String fieldOfStudy;
    
    @NotBlank
    @Column(nullable = false)
    private String university;
    
    @Column(nullable = false)
    private Integer expectedGraduationYear;
    
    // Constructors
    public StudentProfile() {}
    
    public StudentProfile(User user, String fieldOfStudy, String university, Integer expectedGraduationYear) {
        this.user = user;
        this.fieldOfStudy = fieldOfStudy;
        this.university = university;
        this.expectedGraduationYear = expectedGraduationYear;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
