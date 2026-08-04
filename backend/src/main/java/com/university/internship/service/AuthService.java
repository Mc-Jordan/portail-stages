package com.university.internship.service;

import com.university.internship.dto.LoginRequest;
import com.university.internship.dto.LoginResponse;
import com.university.internship.dto.RegisterRequest;
import com.university.internship.exception.UserAlreadyExistsException;
import com.university.internship.model.*;
import com.university.internship.repository.UserRepository;
import com.university.internship.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        // Create profile based on role
        if (request.getRole() == Role.STUDENT) {
            StudentProfile studentProfile = new StudentProfile();
            studentProfile.setUser(savedUser);
            studentProfile.setFieldOfStudy(request.getFieldOfStudy());
            studentProfile.setUniversity(request.getUniversity());
            studentProfile.setExpectedGraduationYear(request.getExpectedGraduationYear());
            savedUser.setStudentProfile(studentProfile);
        } else if (request.getRole() == Role.COMPANY) {
            CompanyProfile companyProfile = new CompanyProfile();
            companyProfile.setUser(savedUser);
            companyProfile.setCompanyName(request.getCompanyName());
            companyProfile.setAddress(request.getAddress());
            companyProfile.setDescription(request.getDescription());
            companyProfile.setWebsite(request.getWebsite());
            savedUser.setCompanyProfile(companyProfile);
        }

        userRepository.save(savedUser);
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);

        return new LoginResponse(token, user.getRole().name());
    }
}
