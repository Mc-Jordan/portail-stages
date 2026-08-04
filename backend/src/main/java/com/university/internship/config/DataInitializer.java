package com.university.internship.config;

import com.university.internship.model.*;
import com.university.internship.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InternshipOfferRepository offerRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InternshipAgreementRepository agreementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create Admin User
        User admin = new User();
        admin.setEmail("admin@university.edu");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setRole(Role.ADMIN);
        admin = userRepository.save(admin);

        // Create Teacher Users
        User teacher1 = new User();
        teacher1.setEmail("dr.smith@university.edu");
        teacher1.setPassword(passwordEncoder.encode("teacher123"));
        teacher1.setFirstName("Dr. John");
        teacher1.setLastName("Smith");
        teacher1.setRole(Role.TEACHER);
        teacher1 = userRepository.save(teacher1);

        User teacher2 = new User();
        teacher2.setEmail("prof.johnson@university.edu");
        teacher2.setPassword(passwordEncoder.encode("teacher123"));
        teacher2.setFirstName("Prof. Sarah");
        teacher2.setLastName("Johnson");
        teacher2.setRole(Role.TEACHER);
        teacher2 = userRepository.save(teacher2);

        // Create Student Users with Profiles
        User student1 = createStudentWithProfile(
            "john.doe@student.edu", "student123", "John", "Doe",
            "Computer Science", "University of Technology", 2025
        );

        User student2 = createStudentWithProfile(
            "jane.wilson@student.edu", "student123", "Jane", "Wilson",
            "Software Engineering", "University of Technology", 2024
        );

        User student3 = createStudentWithProfile(
            "mike.brown@student.edu", "student123", "Mike", "Brown",
            "Data Science", "University of Technology", 2025
        );

        User student4 = createStudentWithProfile(
            "sarah.davis@student.edu", "student123", "Sarah", "Davis",
            "Cybersecurity", "University of Technology", 2024
        );

        // Create Company Users with Profiles
        User company1 = createCompanyWithProfile(
            "hr@techsolutions.com", "company123", "Tech", "Solutions",
            "Tech Solutions Inc.", "123 Silicon Valley, CA", 
            "Leading technology solutions provider specializing in web and mobile applications", 
            "https://techsolutions.com"
        );

        User company2 = createCompanyWithProfile(
            "careers@innovatesoft.com", "company123", "Innovation", "Manager",
            "InnovateSoft Ltd.", "456 Innovation Drive, NY", 
            "Cutting-edge software development company focusing on AI and machine learning", 
            "https://innovatesoft.com"
        );

        User company3 = createCompanyWithProfile(
            "internships@datatech.com", "company123", "Data", "Recruiter",
            "DataTech Corp.", "789 Data Center Blvd, TX", 
            "Big data analytics and cloud computing solutions provider", 
            "https://datatech.com"
        );

        User company4 = createCompanyWithProfile(
            "jobs@cybersecure.com", "company123", "Security", "Lead",
            "CyberSecure Systems", "321 Security Lane, WA", 
            "Cybersecurity consulting and managed security services", 
            "https://cybersecure.com"
        );

        // Create Internship Offers
        InternshipOffer offer1 = createInternshipOffer(
            company1, "Full-Stack Developer Intern", 
            "Work on exciting web applications using React, Node.js, and PostgreSQL. You'll be part of our development team building scalable solutions for enterprise clients.",
            Arrays.asList("React", "Node.js", "PostgreSQL", "JavaScript", "HTML/CSS"),
            "Computer Science", "San Francisco, CA", 6, LocalDate.of(2024, 6, 1)
        );

        InternshipOffer offer2 = createInternshipOffer(
            company1, "Mobile App Developer Intern", 
            "Develop mobile applications for iOS and Android platforms using React Native and Flutter.",
            Arrays.asList("React Native", "Flutter", "iOS", "Android", "JavaScript"),
            "Software Engineering", "San Francisco, CA", 4, LocalDate.of(2024, 7, 1)
        );

        InternshipOffer offer3 = createInternshipOffer(
            company2, "AI/ML Research Intern", 
            "Research and develop machine learning models for natural language processing and computer vision applications.",
            Arrays.asList("Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science"),
            "Data Science", "New York, NY", 6, LocalDate.of(2024, 6, 15)
        );

        InternshipOffer offer4 = createInternshipOffer(
            company2, "Backend Developer Intern", 
            "Build robust backend services and APIs using Java Spring Boot and microservices architecture.",
            Arrays.asList("Java", "Spring Boot", "Microservices", "Docker", "Kubernetes"),
            "Computer Science", "New York, NY", 5, LocalDate.of(2024, 8, 1)
        );

        InternshipOffer offer5 = createInternshipOffer(
            company3, "Data Analytics Intern", 
            "Analyze large datasets to extract business insights using Python, SQL, and visualization tools.",
            Arrays.asList("Python", "SQL", "Tableau", "Power BI", "Statistics"),
            "Data Science", "Austin, TX", 4, LocalDate.of(2024, 7, 15)
        );

        InternshipOffer offer6 = createInternshipOffer(
            company4, "Cybersecurity Analyst Intern", 
            "Learn about threat detection, vulnerability assessment, and security monitoring in enterprise environments.",
            Arrays.asList("Network Security", "Penetration Testing", "SIEM", "Python", "Linux"),
            "Cybersecurity", "Seattle, WA", 6, LocalDate.of(2024, 6, 1)
        );

        // Create Applications
        Application app1 = createApplication(
            offer1, student1, "cv_john_doe.pdf",
            "I am very excited about this full-stack developer internship opportunity. My experience with React and Node.js from university projects makes me a great fit for this role."
        );

        Application app2 = createApplication(
            offer3, student3, "cv_mike_brown.pdf",
            "As a Data Science student passionate about AI/ML, I would love to contribute to your research projects. I have hands-on experience with TensorFlow and PyTorch."
        );

        Application app3 = createApplication(
            offer6, student4, "cv_sarah_davis.pdf",
            "Cybersecurity is my passion, and I would be thrilled to learn from your expert team. I have completed several security courses and CTF competitions."
        );

        Application app4 = createApplication(
            offer2, student2, "cv_jane_wilson.pdf",
            "I am interested in mobile development and have built several React Native apps during my studies. I would love to gain professional experience in this field."
        );

        Application app5 = createApplication(
            offer4, student1, "cv_john_doe_backend.pdf",
            "While I enjoy full-stack development, I'm particularly interested in backend architecture and would love to learn about microservices."
        );

        // Update some application statuses and create agreements
        app1.setStatus(ApplicationStatus.ACCEPTED);
        app1.setFeedback("Excellent profile! We're excited to have you join our team.");
        app1 = applicationRepository.save(app1);

        app2.setStatus(ApplicationStatus.ACCEPTED);
        app2.setFeedback("Your ML background is impressive. Looking forward to working with you on our AI projects.");
        app2 = applicationRepository.save(app2);

        app3.setStatus(ApplicationStatus.PENDING);
        app3 = applicationRepository.save(app3);

        app4.setStatus(ApplicationStatus.REJECTED);
        app4.setFeedback("Thank you for your interest. We decided to go with a candidate with more mobile experience.");
        app4 = applicationRepository.save(app4);

        app5.setStatus(ApplicationStatus.PENDING);
        app5 = applicationRepository.save(app5);

        // Create Internship Agreements for accepted applications
        InternshipAgreement agreement1 = new InternshipAgreement();
        agreement1.setApplication(app1);
        agreement1.setStatus(AgreementStatus.PENDING_TEACHER_VALIDATION);
        agreement1 = agreementRepository.save(agreement1);

        InternshipAgreement agreement2 = new InternshipAgreement();
        agreement2.setApplication(app2);
        agreement2.setStatus(AgreementStatus.VALIDATED);
        agreement2.setValidatingTeacher(teacher1);
        agreement2.setTeacherComments("All requirements are met. The internship plan is well-structured and aligns with the student's academic goals.");
        agreement2 = agreementRepository.save(agreement2);

        System.out.println("✅ Sample data initialized successfully!");
        System.out.println("📊 Created:");
        System.out.println("   - 1 Admin user");
        System.out.println("   - 2 Teacher users");
        System.out.println("   - 4 Student users with profiles");
        System.out.println("   - 4 Company users with profiles");
        System.out.println("   - 6 Internship offers");
        System.out.println("   - 5 Applications (2 accepted, 1 rejected, 2 pending)");
        System.out.println("   - 2 Internship agreements (1 pending validation, 1 validated)");
        System.out.println();
        System.out.println("🔐 Test Credentials:");
        System.out.println("   Admin: admin@university.edu / admin123");
        System.out.println("   Teacher: dr.smith@university.edu / teacher123");
        System.out.println("   Student: john.doe@student.edu / student123");
        System.out.println("   Company: hr@techsolutions.com / company123");
    }

    private User createStudentWithProfile(String email, String password, String firstName, String lastName,
                                        String fieldOfStudy, String university, Integer graduationYear) {
        User student = new User();
        student.setEmail(email);
        student.setPassword(passwordEncoder.encode(password));
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setRole(Role.STUDENT);
        student = userRepository.save(student);

        StudentProfile profile = new StudentProfile();
        profile.setUser(student);
        profile.setFieldOfStudy(fieldOfStudy);
        profile.setUniversity(university);
        profile.setExpectedGraduationYear(graduationYear);
        student.setStudentProfile(profile);

        return userRepository.save(student);
    }

    private User createCompanyWithProfile(String email, String password, String firstName, String lastName,
                                        String companyName, String address, String description, String website) {
        User company = new User();
        company.setEmail(email);
        company.setPassword(passwordEncoder.encode(password));
        company.setFirstName(firstName);
        company.setLastName(lastName);
        company.setRole(Role.COMPANY);
        company = userRepository.save(company);

        CompanyProfile profile = new CompanyProfile();
        profile.setUser(company);
        profile.setCompanyName(companyName);
        profile.setAddress(address);
        profile.setDescription(description);
        profile.setWebsite(website);
        company.setCompanyProfile(profile);

        return userRepository.save(company);
    }

    private InternshipOffer createInternshipOffer(User company, String title, String description,
                                                List<String> requiredSkills, String domain, String location,
                                                Integer duration, LocalDate startDate) {
        InternshipOffer offer = new InternshipOffer();
        offer.setCompany(company);
        offer.setTitle(title);
        offer.setDescription(description);
        offer.setRequiredSkills(requiredSkills);
        offer.setDomain(domain);
        offer.setLocation(location);
        offer.setDurationInMonths(duration);
        offer.setStartDate(startDate);
        offer.setStatus(OfferStatus.OPEN);
        return offerRepository.save(offer);
    }

    private Application createApplication(InternshipOffer offer, User student, String cvUrl, String coverLetter) {
        Application application = new Application();
        application.setInternshipOffer(offer);
        application.setStudent(student);
        application.setCvUrl(cvUrl);
        application.setCoverLetter(coverLetter);
        application.setApplicationDate(LocalDateTime.now().minusDays((long) (Math.random() * 30)));
        application.setStatus(ApplicationStatus.PENDING);
        return applicationRepository.save(application);
    }
}
