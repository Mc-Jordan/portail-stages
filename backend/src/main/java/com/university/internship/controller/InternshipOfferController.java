package com.university.internship.controller;

import com.university.internship.dto.InternshipOfferDTO;
import com.university.internship.model.User;
import com.university.internship.service.InternshipOfferService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offers")
@CrossOrigin(origins = "*")
public class InternshipOfferController {

    @Autowired
    private InternshipOfferService offerService;

    @PostMapping
    public ResponseEntity<InternshipOfferDTO> createOffer(@Valid @RequestBody InternshipOfferDTO offerDTO, 
                                                         Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        InternshipOfferDTO createdOffer = offerService.createOffer(offerDTO, currentUser);
        return new ResponseEntity<>(createdOffer, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InternshipOfferDTO>> getAllOffers(
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) Integer duration,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search) {
        List<InternshipOfferDTO> offers = offerService.getAllOffers(domain, duration, location, search);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternshipOfferDTO> getOfferById(@PathVariable Long id) {
        InternshipOfferDTO offer = offerService.getOfferById(id);
        return ResponseEntity.ok(offer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InternshipOfferDTO> updateOffer(@PathVariable Long id, 
                                                         @Valid @RequestBody InternshipOfferDTO offerDTO,
                                                         Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        InternshipOfferDTO updatedOffer = offerService.updateOffer(id, offerDTO, currentUser);
        return ResponseEntity.ok(updatedOffer);
    }

    @GetMapping("/company/me")
    public ResponseEntity<List<InternshipOfferDTO>> getMyOffers(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        List<InternshipOfferDTO> offers = offerService.getCompanyOffers(currentUser);
        return ResponseEntity.ok(offers);
    }
}
