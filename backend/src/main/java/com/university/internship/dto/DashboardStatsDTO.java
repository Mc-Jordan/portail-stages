package com.university.internship.dto;

import java.util.List;

public class DashboardStatsDTO {
    
    private List<FieldStatsDTO> internshipsByField;
    private List<MonthlyStatsDTO> applicationsPerMonth;
    private long totalUsers;
    private long totalOffers;
    private long totalApplications;
    private long totalAgreements;
    
    // Constructors
    public DashboardStatsDTO() {}
    
    // Getters and Setters
    public List<FieldStatsDTO> getInternshipsByField() {
        return internshipsByField;
    }
    
    public void setInternshipsByField(List<FieldStatsDTO> internshipsByField) {
        this.internshipsByField = internshipsByField;
    }
    
    public List<MonthlyStatsDTO> getApplicationsPerMonth() {
        return applicationsPerMonth;
    }
    
    public void setApplicationsPerMonth(List<MonthlyStatsDTO> applicationsPerMonth) {
        this.applicationsPerMonth = applicationsPerMonth;
    }
    
    public long getTotalUsers() {
        return totalUsers;
    }
    
    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }
    
    public long getTotalOffers() {
        return totalOffers;
    }
    
    public void setTotalOffers(long totalOffers) {
        this.totalOffers = totalOffers;
    }
    
    public long getTotalApplications() {
        return totalApplications;
    }
    
    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }
    
    public long getTotalAgreements() {
        return totalAgreements;
    }
    
    public void setTotalAgreements(long totalAgreements) {
        this.totalAgreements = totalAgreements;
    }
    
    // Inner classes for nested data
    public static class FieldStatsDTO {
        private String field;
        private long count;
        
        public FieldStatsDTO() {}
        
        public FieldStatsDTO(String field, long count) {
            this.field = field;
            this.count = count;
        }
        
        public String getField() {
            return field;
        }
        
        public void setField(String field) {
            this.field = field;
        }
        
        public long getCount() {
            return count;
        }
        
        public void setCount(long count) {
            this.count = count;
        }
    }
    
    public static class MonthlyStatsDTO {
        private String month;
        private long count;
        
        public MonthlyStatsDTO() {}
        
        public MonthlyStatsDTO(String month, long count) {
            this.month = month;
            this.count = count;
        }
        
        public String getMonth() {
            return month;
        }
        
        public void setMonth(String month) {
            this.month = month;
        }
        
        public long getCount() {
            return count;
        }
        
        public void setCount(long count) {
            this.count = count;
        }
    }
}
