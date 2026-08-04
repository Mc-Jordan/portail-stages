package com.university.internship.repository;

import com.university.internship.model.InternshipOffer;
import com.university.internship.model.OfferStatus;
import com.university.internship.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipOfferRepository extends JpaRepository<InternshipOffer, Long> {
    
    List<InternshipOffer> findByStatus(OfferStatus status);
    
    List<InternshipOffer> findByCompany(User company);
    
    @Query("SELECT o FROM InternshipOffer o WHERE " +
           "(:domain IS NULL OR o.domain = :domain) AND " +
           "(:duration IS NULL OR o.durationInMonths = :duration) AND " +
           "(:location IS NULL OR LOWER(o.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:search IS NULL OR LOWER(o.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "o.status = 'OPEN'")
    List<InternshipOffer> findOffersWithFilters(
            @Param("domain") String domain,
            @Param("duration") Integer duration,
            @Param("location") String location,
            @Param("search") String search
    );
}
