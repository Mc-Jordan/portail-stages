package com.university.internship.service;

import com.university.internship.dto.AgreementDTO;
import com.university.internship.dto.ValidateAgreementRequest;
import com.university.internship.exception.ResourceNotFoundException;
import com.university.internship.exception.UnauthorizedException;
import com.university.internship.model.*;
import com.university.internship.repository.InternshipAgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipAgreementService {

    @Autowired
    private InternshipAgreementRepository agreementRepository;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private FileStorageService fileStorageService;

    @Transactional
    public InternshipAgreement createAgreement(Application application) {
        InternshipAgreement agreement = new InternshipAgreement();
        agreement.setApplication(application);
        agreement.setStatus(AgreementStatus.PENDING_TEACHER_VALIDATION);
        
        return agreementRepository.save(agreement);
    }

    public List<AgreementDTO> getPendingAgreements() {
        List<InternshipAgreement> agreements = agreementRepository.findPendingValidation();
        return agreements.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<AgreementDTO> getValidatedAgreements() {
        List<InternshipAgreement> agreements = agreementRepository.findValidated();
        return agreements.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public AgreementDTO validateAgreement(Long agreementId, ValidateAgreementRequest request, User teacher) {
        if (teacher.getRole() != Role.TEACHER) {
            throw new UnauthorizedException("Only teachers can validate agreements");
        }

        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("Agreement not found with id: " + agreementId));

        agreement.setValidatingTeacher(teacher);
        agreement.setStatus(request.getDecision());
        agreement.setTeacherComments(request.getComments());

        InternshipAgreement updatedAgreement = agreementRepository.save(agreement);
        return convertToDTO(updatedAgreement);
    }

    public Resource downloadAgreement(Long agreementId, User currentUser) throws IOException {
        InternshipAgreement agreement = agreementRepository.findById(agreementId)
                .orElseThrow(() -> new ResourceNotFoundException("Agreement not found with id: " + agreementId));

        // Check authorization
        boolean isAuthorized = currentUser.getRole() == Role.ADMIN ||
                              currentUser.getRole() == Role.TEACHER ||
                              (currentUser.getRole() == Role.STUDENT && 
                               agreement.getApplication().getStudent().getId().equals(currentUser.getId()));

        if (!isAuthorized) {
            throw new UnauthorizedException("You are not authorized to download this agreement");
        }

        // Generate PDF if not exists
        if (agreement.getPdfUrl() == null) {
            String pdfFilename = pdfGenerationService.generateAgreementPdf(agreement);
            agreement.setPdfUrl(pdfFilename);
            agreementRepository.save(agreement);
        }

        try {
            Path filePath = fileStorageService.getFilePath(agreement.getPdfUrl());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Agreement PDF file not found");
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Agreement PDF file not found");
        }
    }

    private AgreementDTO convertToDTO(InternshipAgreement agreement) {
        AgreementDTO dto = new AgreementDTO();
        dto.setId(agreement.getId());
        dto.setApplicationId(agreement.getApplication().getId());
        dto.setPdfUrl(agreement.getPdfUrl());
        dto.setGenerationDate(agreement.getGenerationDate());
        dto.setStatus(agreement.getStatus());
        dto.setTeacherComments(agreement.getTeacherComments());

        // Student information
        User student = agreement.getApplication().getStudent();
        dto.setStudentName(student.getFirstName() + " " + student.getLastName());
        dto.setStudentEmail(student.getEmail());

        if (student.getStudentProfile() != null) {
            dto.setFieldOfStudy(student.getStudentProfile().getFieldOfStudy());
            dto.setUniversity(student.getStudentProfile().getUniversity());
            dto.setExpectedGraduationYear(student.getStudentProfile().getExpectedGraduationYear());
        }

        // Company information
        if (agreement.getApplication().getInternshipOffer().getCompany().getCompanyProfile() != null) {
            dto.setCompanyName(agreement.getApplication().getInternshipOffer().getCompany().getCompanyProfile().getCompanyName());
        }

        // Offer information
        dto.setOfferTitle(agreement.getApplication().getInternshipOffer().getTitle());

        // Teacher information
        if (agreement.getValidatingTeacher() != null) {
            dto.setValidatingTeacherId(agreement.getValidatingTeacher().getId());
            dto.setValidatingTeacherName(agreement.getValidatingTeacher().getFirstName() + " " + 
                                       agreement.getValidatingTeacher().getLastName());
        }

        return dto;
    }
}
