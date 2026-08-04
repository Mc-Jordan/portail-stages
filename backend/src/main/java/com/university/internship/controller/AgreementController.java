package com.university.internship.controller;

import com.university.internship.dto.AgreementDTO;
import com.university.internship.dto.ValidateAgreementRequest;
import com.university.internship.model.User;
import com.university.internship.service.InternshipAgreementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/agreements")
@CrossOrigin(origins = "*")
public class AgreementController {

    @Autowired
    private InternshipAgreementService agreementService;

    @GetMapping("/teacher/pending")
    public ResponseEntity<List<AgreementDTO>> getPendingAgreements() {
        List<AgreementDTO> agreements = agreementService.getPendingAgreements();
        return ResponseEntity.ok(agreements);
    }

    @GetMapping("/teacher/validated")
    public ResponseEntity<List<AgreementDTO>> getValidatedAgreements() {
        List<AgreementDTO> agreements = agreementService.getValidatedAgreements();
        return ResponseEntity.ok(agreements);
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<AgreementDTO> validateAgreement(@PathVariable Long id,
                                                         @Valid @RequestBody ValidateAgreementRequest request,
                                                         Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        AgreementDTO updatedAgreement = agreementService.validateAgreement(id, request, currentUser);
        return ResponseEntity.ok(updatedAgreement);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadAgreement(@PathVariable Long id,
                                                     Authentication authentication) throws IOException {
        User currentUser = (User) authentication.getPrincipal();
        Resource file = agreementService.downloadAgreement(id, currentUser);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"agreement_" + id + ".pdf\"")
                .body(file);
    }
}
