package com.university.internship.dto;

import com.university.internship.model.Role;
import jakarta.validation.constraints.NotNull;

public class UpdateRoleRequest {
    
    @NotNull
    private Role newRole;
    
    // Constructors
    public UpdateRoleRequest() {}
    
    public UpdateRoleRequest(Role newRole) {
        this.newRole = newRole;
    }
    
    // Getters and Setters
    public Role getNewRole() {
        return newRole;
    }
    
    public void setNewRole(Role newRole) {
        this.newRole = newRole;
    }
}
