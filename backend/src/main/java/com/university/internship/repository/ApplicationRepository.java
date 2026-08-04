package com.university.internship.repository;

import com.university.internship.model.Application;
import com.university.internship.model.InternshipOffer;
import com.university.internship.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findByStudent(User student);
    
    List<Application> findByInternshipOffer(InternshipOffer internshipOffer);
    
    Optional<Application> findByStudentAndInternshipOffer(User student, InternshipOffer internshipOffer);
    
    boolean existsByStudentAndInternshipOffer(User student, InternshipOffer internshipOffer);
}
