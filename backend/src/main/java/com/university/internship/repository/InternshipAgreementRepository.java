package com.university.internship.repository;

import com.university.internship.model.AgreementStatus;
import com.university.internship.model.InternshipAgreement;
import com.university.internship.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipAgreementRepository extends JpaRepository<InternshipAgreement, Long> {
    
    List<InternshipAgreement> findByStatus(AgreementStatus status);
    
    List<InternshipAgreement> findByValidatingTeacher(User teacher);
    
    @Query("SELECT a FROM InternshipAgreement a WHERE a.status = 'PENDING_TEACHER_VALIDATION'")
    List<InternshipAgreement> findPendingValidation();

    @Query("SELECT a FROM InternshipAgreement a WHERE a.status = 'VALIDATED'")
    List<InternshipAgreement> findValidated();
}
