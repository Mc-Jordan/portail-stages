package com.university.internship.controller;

import com.university.internship.dto.DashboardStatsDTO;
import com.university.internship.dto.UpdateRoleRequest;
import com.university.internship.dto.UserDTO;
import com.university.internship.model.User;
import com.university.internship.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long userId,
                                                 @Valid @RequestBody UpdateRoleRequest request,
                                                 Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        UserDTO updatedUser = adminService.updateUserRole(userId, request, currentUser);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reports/internships-by-field")
    public ResponseEntity<byte[]> getInternshipsReport() throws IOException {
        byte[] excelData = adminService.generateInternshipsReport();
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"internships_report.xlsx\"")
                .body(excelData);
    }
}
