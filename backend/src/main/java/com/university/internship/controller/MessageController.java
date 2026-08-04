package com.university.internship.controller;

import com.university.internship.dto.ChatMessage;
import com.university.internship.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{companyId}/{studentId}")
    @SendTo("/topic/messages/{companyId}/{studentId}")
    public ChatMessage sendMessage(@DestinationVariable Long companyId, 
                                  @DestinationVariable Long studentId,
                                  ChatMessage message,
                                  Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        
        message.setSenderId(currentUser.getId());
        message.setSenderName(currentUser.getFirstName() + " " + currentUser.getLastName());
        message.setMessageType("CHAT");
        
        return message;
    }

    public void sendNotification(Long userId, String type, String message, String link) {
        com.university.internship.dto.NotificationMessage notification = 
            new com.university.internship.dto.NotificationMessage(type, message, link);
        
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
    }
}
