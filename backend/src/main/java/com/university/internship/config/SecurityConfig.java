package com.university.internship.config;

import com.university.internship.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/ws/**").permitAll() // WebSocket endpoints
                        
                        // Admin endpoints
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        
                        // Company endpoints
//                        .requestMatchers("POST", "/offers/**").hasAuthority("COMPANY")
//                        .requestMatchers("PUT", "/offers/**").hasAuthority("COMPANY")
//                        .requestMatchers("GET", "/offers/*/applications").hasAuthority("COMPANY")
                        .requestMatchers("POST", "/applications/*/update-status").hasAuthority("COMPANY")
                        
                        // Student endpoints
//                        .requestMatchers("POST", "/offers/*/apply").hasAuthority("STUDENT")
//                        .requestMatchers("GET", "/applications/student/me").hasAuthority("STUDENT")
                        
                        // Teacher endpoints
                        .requestMatchers("GET", "/agreements/teacher/pending").hasAuthority("TEACHER")
                        .requestMatchers("POST", "/agreements/*/validate").hasAuthority("TEACHER")
                        
                        // Multi-role endpoints
//                        .requestMatchers("GET", "/offers").hasAnyAuthority("STUDENT", "TEACHER", "ADMIN")
//                        .requestMatchers("GET", "/offers/**").hasAnyAuthority("STUDENT", "TEACHER", "ADMIN")
//                        .requestMatchers("GET", "/agreements/*/download").hasAnyAuthority("TEACHER", "STUDENT", "ADMIN")
                        
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
