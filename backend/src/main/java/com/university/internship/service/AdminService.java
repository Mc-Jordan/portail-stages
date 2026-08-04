package com.university.internship.service;

import com.university.internship.dto.DashboardStatsDTO;
import com.university.internship.dto.UpdateRoleRequest;
import com.university.internship.dto.UserDTO;
import com.university.internship.exception.ResourceNotFoundException;
import com.university.internship.exception.UnauthorizedException;
import com.university.internship.model.Role;
import com.university.internship.model.User;
import com.university.internship.repository.ApplicationRepository;
import com.university.internship.repository.InternshipAgreementRepository;
import com.university.internship.repository.InternshipOfferRepository;
import com.university.internship.repository.UserRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InternshipOfferRepository offerRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InternshipAgreementRepository agreementRepository;

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::convertToUserDTO).collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUserRole(Long userId, UpdateRoleRequest request, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only administrators can update user roles");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setRole(request.getNewRole());
        User updatedUser = userRepository.save(user);
        return convertToUserDTO(updatedUser);
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // Basic counts
        stats.setTotalUsers(userRepository.count());
        stats.setTotalOffers(offerRepository.count());
        stats.setTotalApplications(applicationRepository.count());
        stats.setTotalAgreements(agreementRepository.count());

        // This is a simplified implementation - in a real application,
        // you would use proper SQL queries with GROUP BY clauses
        stats.setInternshipsByField(List.of(
            new DashboardStatsDTO.FieldStatsDTO("Computer Science", 25),
            new DashboardStatsDTO.FieldStatsDTO("Engineering", 15),
            new DashboardStatsDTO.FieldStatsDTO("Business", 10),
            new DashboardStatsDTO.FieldStatsDTO("Design", 8)
        ));

        stats.setApplicationsPerMonth(List.of(
            new DashboardStatsDTO.MonthlyStatsDTO("January", 12),
            new DashboardStatsDTO.MonthlyStatsDTO("February", 18),
            new DashboardStatsDTO.MonthlyStatsDTO("March", 25),
            new DashboardStatsDTO.MonthlyStatsDTO("April", 20)
        ));

        return stats;
    }

    public byte[] generateInternshipsReport() throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Internships Report");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Agreement ID");
            headerRow.createCell(1).setCellValue("Student Name");
            headerRow.createCell(2).setCellValue("Student Email");
            headerRow.createCell(3).setCellValue("Field of Study");
            headerRow.createCell(4).setCellValue("University");
            headerRow.createCell(5).setCellValue("Company Name");
            headerRow.createCell(6).setCellValue("Position Title");
            headerRow.createCell(7).setCellValue("Duration (Months)");
            headerRow.createCell(8).setCellValue("Start Date");
            headerRow.createCell(9).setCellValue("Status");
            headerRow.createCell(10).setCellValue("Generation Date");

            // Get all agreements and populate rows
            List<com.university.internship.model.InternshipAgreement> agreements = agreementRepository.findAll();
            int rowNum = 1;

            for (com.university.internship.model.InternshipAgreement agreement : agreements) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(agreement.getId());
                
                User student = agreement.getApplication().getStudent();
                row.createCell(1).setCellValue(student.getFirstName() + " " + student.getLastName());
                row.createCell(2).setCellValue(student.getEmail());
                
                if (student.getStudentProfile() != null) {
                    row.createCell(3).setCellValue(student.getStudentProfile().getFieldOfStudy());
                    row.createCell(4).setCellValue(student.getStudentProfile().getUniversity());
                } else {
                    row.createCell(3).setCellValue("N/A");
                    row.createCell(4).setCellValue("N/A");
                }
                
                if (agreement.getApplication().getInternshipOffer().getCompany().getCompanyProfile() != null) {
                    row.createCell(5).setCellValue(
                        agreement.getApplication().getInternshipOffer().getCompany().getCompanyProfile().getCompanyName()
                    );
                } else {
                    row.createCell(5).setCellValue("N/A");
                }
                
                row.createCell(6).setCellValue(agreement.getApplication().getInternshipOffer().getTitle());
                row.createCell(7).setCellValue(agreement.getApplication().getInternshipOffer().getDurationInMonths());
                row.createCell(8).setCellValue(agreement.getApplication().getInternshipOffer().getStartDate().toString());
                row.createCell(9).setCellValue(agreement.getStatus().toString());
                row.createCell(10).setCellValue(
                    agreement.getGenerationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                );
            }

            // Auto-size columns
            for (int i = 0; i < 11; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());

        if (user.getCompanyProfile() != null) {
            dto.setCompanyName(user.getCompanyProfile().getCompanyName());
        }

        if (user.getStudentProfile() != null) {
            dto.setFieldOfStudy(user.getStudentProfile().getFieldOfStudy());
            dto.setUniversity(user.getStudentProfile().getUniversity());
        }

        return dto;
    }
}
