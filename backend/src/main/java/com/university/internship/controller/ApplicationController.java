package com.university.internship.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.university.internship.dto.ApplicationDTO;
import com.university.internship.dto.ApplicationRequest;
import com.university.internship.dto.UpdateApplicationStatusRequest;
import com.university.internship.model.User;
import com.university.internship.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/apply/{offerId}")
    public ResponseEntity<ApplicationDTO> applyToOffer(@PathVariable Long offerId,
                                                      @RequestPart("cv") MultipartFile cvFile,
                                                      @RequestPart("applicationData") String applicationDataJson,
                                                      Authentication authentication) throws IOException {
        User currentUser = (User) authentication.getPrincipal();
        
        // Parse application data from JSON
        ApplicationRequest applicationData = objectMapper.readValue(applicationDataJson, ApplicationRequest.class);
        
        ApplicationDTO application = applicationService.applyToOffer(
                offerId, 
                applicationData.getCoverLetter(), 
                cvFile, 
                currentUser
        );
        return new ResponseEntity<>(application, HttpStatus.CREATED);
    }

    @GetMapping("/student/me")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<ApplicationDTO> applications = applicationService.getStudentApplications(currentUser);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/offer/{offerId}")
    public ResponseEntity<List<ApplicationDTO>> getOfferApplications(@PathVariable Long offerId,
                                                                   Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<ApplicationDTO> applications = applicationService.getOfferApplications(offerId, currentUser);
        return ResponseEntity.ok(applications);
    }

    @PostMapping("/{applicationId}/update-status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(@PathVariable Long applicationId,
                                                                @Valid @RequestBody UpdateApplicationStatusRequest request,
                                                                Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        ApplicationDTO updatedApplication = applicationService.updateApplicationStatus(applicationId, request, currentUser);
        return ResponseEntity.ok(updatedApplication);
    }
}
