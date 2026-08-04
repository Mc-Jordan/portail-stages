package com.university.internship.service;

import com.university.internship.dto.InternshipOfferDTO;
import com.university.internship.exception.ResourceNotFoundException;
import com.university.internship.exception.UnauthorizedException;
import com.university.internship.model.InternshipOffer;
import com.university.internship.model.OfferStatus;
import com.university.internship.model.Role;
import com.university.internship.model.User;
import com.university.internship.repository.InternshipOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class InternshipOfferService {

    @Autowired
    private InternshipOfferRepository offerRepository;

    @Transactional
    public InternshipOfferDTO createOffer(InternshipOfferDTO offerDTO, User company) {
        if (company.getRole() != Role.COMPANY) {
            throw new UnauthorizedException("Only companies can create internship offers");
        }

        InternshipOffer offer = new InternshipOffer();
        offer.setCompany(company);
        offer.setTitle(offerDTO.getTitle());
        offer.setDescription(offerDTO.getDescription());
        offer.setRequiredSkills(offerDTO.getRequiredSkills());
        offer.setDomain(offerDTO.getDomain());
        offer.setLocation(offerDTO.getLocation());
        offer.setDurationInMonths(offerDTO.getDurationInMonths());
        offer.setStartDate(offerDTO.getStartDate());
        offer.setStatus(OfferStatus.OPEN);

        InternshipOffer savedOffer = offerRepository.save(offer);
        return convertToDTO(savedOffer);
    }

    public List<InternshipOfferDTO> getAllOffers(String domain, Integer duration, String location, String search) {
        if (Objects.isNull(domain) && duration == null && location == null && search == null) {
            return offerRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
        }
        List<InternshipOffer> offers = offerRepository.findOffersWithFilters(domain, duration, location, search);
        return offers.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public InternshipOfferDTO getOfferById(Long id) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship offer not found with id: " + id));
        return convertToDTO(offer);
    }

    @Transactional
    public InternshipOfferDTO updateOffer(Long id, InternshipOfferDTO offerDTO, User currentUser) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship offer not found with id: " + id));

        if (!offer.getCompany().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own offers");
        }

        offer.setTitle(offerDTO.getTitle());
        offer.setDescription(offerDTO.getDescription());
        offer.setRequiredSkills(offerDTO.getRequiredSkills());
        offer.setDomain(offerDTO.getDomain());
        offer.setLocation(offerDTO.getLocation());
        offer.setDurationInMonths(offerDTO.getDurationInMonths());
        offer.setStartDate(offerDTO.getStartDate());
        
        if (offerDTO.getStatus() != null) {
            offer.setStatus(offerDTO.getStatus());
        }

        InternshipOffer updatedOffer = offerRepository.save(offer);
        return convertToDTO(updatedOffer);
    }

    public List<InternshipOfferDTO> getCompanyOffers(User company) {
        List<InternshipOffer> offers = offerRepository.findByCompany(company);
        return offers.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private InternshipOfferDTO convertToDTO(InternshipOffer offer) {
        InternshipOfferDTO dto = new InternshipOfferDTO();
        dto.setId(offer.getId());
        dto.setTitle(offer.getTitle());
        dto.setDescription(offer.getDescription());
        dto.setRequiredSkills(offer.getRequiredSkills());
        dto.setDomain(offer.getDomain());
        dto.setLocation(offer.getLocation());
        dto.setDurationInMonths(offer.getDurationInMonths());
        dto.setStartDate(offer.getStartDate());
        dto.setStatus(offer.getStatus());
        dto.setCreatedDate(offer.getCreatedDate());
        dto.setCompanyId(offer.getCompany().getId());
        
        if (offer.getCompany().getCompanyProfile() != null) {
            dto.setCompanyName(offer.getCompany().getCompanyProfile().getCompanyName());
        }
        
        return dto;
    }
}
