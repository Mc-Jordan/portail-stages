package com.university.internship.service;

import com.university.internship.dto.ApplicationDTO;
import com.university.internship.dto.UpdateApplicationStatusRequest;
import com.university.internship.exception.ResourceNotFoundException;
import com.university.internship.exception.UnauthorizedException;
import com.university.internship.model.*;
import com.university.internship.repository.ApplicationRepository;
import com.university.internship.repository.InternshipOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InternshipOfferRepository offerRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private InternshipAgreementService agreementService;

    @Autowired
    private com.university.internship.controller.MessageController messageController;

    @Transactional
    public ApplicationDTO applyToOffer(Long offerId, String coverLetter, MultipartFile cvFile, User student) throws IOException {
        if (student.getRole() != Role.STUDENT) {
            throw new UnauthorizedException("Only students can apply to internship offers");
        }

        InternshipOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship offer not found with id: " + offerId));

        if (offer.getStatus() != OfferStatus.OPEN) {
            throw new UnauthorizedException("This internship offer is no longer accepting applications");
        }

        // Check if student already applied
        if (applicationRepository.existsByStudentAndInternshipOffer(student, offer)) {
            throw new UnauthorizedException("You have already applied to this internship offer");
        }

        // Store CV file
        String cvUrl = fileStorageService.storeFile(cvFile);

        Application application = new Application();
        application.setInternshipOffer(offer);
        application.setStudent(student);
        application.setCoverLetter(coverLetter);
        application.setCvUrl(cvUrl);

        Application savedApplication = applicationRepository.save(application);
        return convertToDTO(savedApplication);
    }

    public List<ApplicationDTO> getStudentApplications(User student) {
        List<Application> applications = applicationRepository.findByStudent(student);
        return applications.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<ApplicationDTO> getOfferApplications(Long offerId, User company) {
        InternshipOffer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship offer not found with id: " + offerId));

        if (!offer.getCompany().getId().equals(company.getId())) {
            throw new UnauthorizedException("You can only view applications for your own offers");
        }

        List<Application> applications = applicationRepository.findByInternshipOffer(offer);
        return applications.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Long applicationId, UpdateApplicationStatusRequest request, User company) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getInternshipOffer().getCompany().getId().equals(company.getId())) {
            throw new UnauthorizedException("You can only update applications for your own offers");
        }

        application.setStatus(request.getStatus());
        application.setFeedback(request.getFeedback());

        Application updatedApplication = applicationRepository.save(application);

        // If application is accepted, create internship agreement
        if (request.getStatus() == ApplicationStatus.ACCEPTED) {
            agreementService.createAgreement(application);
            
            // Send notification to student
            messageController.sendNotification(
                application.getStudent().getId(),
                "APPLICATION_STATUS_UPDATE",
                "Your application for '" + application.getInternshipOffer().getTitle() + "' has been accepted!",
                "/applications/" + application.getId()
            );
        } else if (request.getStatus() == ApplicationStatus.REJECTED) {
            // Send notification to student
            messageController.sendNotification(
                application.getStudent().getId(),
                "APPLICATION_STATUS_UPDATE",
                "Your application for '" + application.getInternshipOffer().getTitle() + "' has been reviewed.",
                "/applications/" + application.getId()
            );
        }

        return convertToDTO(updatedApplication);
    }

    private ApplicationDTO convertToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setInternshipOfferId(application.getInternshipOffer().getId());
        dto.setOfferTitle(application.getInternshipOffer().getTitle());
        dto.setStudentId(application.getStudent().getId());
        dto.setStudentName(application.getStudent().getFirstName() + " " + application.getStudent().getLastName());
        dto.setStudentEmail(application.getStudent().getEmail());
        dto.setCvUrl(application.getCvUrl());
        dto.setCoverLetter(application.getCoverLetter());
        dto.setApplicationDate(application.getApplicationDate());
        dto.setStatus(application.getStatus());
        dto.setFeedback(application.getFeedback());

        // Company information
        if (application.getInternshipOffer().getCompany().getCompanyProfile() != null) {
            dto.setCompanyName(application.getInternshipOffer().getCompany().getCompanyProfile().getCompanyName());
        }

        // Student profile information
        if (application.getStudent().getStudentProfile() != null) {
            StudentProfile profile = application.getStudent().getStudentProfile();
            dto.setFieldOfStudy(profile.getFieldOfStudy());
            dto.setUniversity(profile.getUniversity());
            dto.setExpectedGraduationYear(profile.getExpectedGraduationYear());
        }

        return dto;
    }
}
