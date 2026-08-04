'use client';

import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';
import { ChatMessage, NotificationMessage } from '@/types';

interface UseWebSocketProps {
  userId: number;
  onMessageReceived?: (message: ChatMessage) => void;
  onNotificationReceived?: (notification: NotificationMessage) => void;
}

export function useWebSocket({ 
  userId, 
  onMessageReceived, 
  onNotificationReceived 
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  const onNotificationReceivedRef = useRef(onNotificationReceived);
  const onMessageReceivedRef = useRef(onMessageReceived);

  // Update the refs whenever the callbacks change
  useEffect(() => {
    onNotificationReceivedRef.current = onNotificationReceived;
    onMessageReceivedRef.current = onMessageReceived;
  });

  useEffect(() => {
    if (!userId || !token) {
      if (clientRef.current?.active) {
        console.log('Deactivating WebSocket client due to missing user/token');
        clientRef.current.deactivate();
      }
      return;
    }

    if (!clientRef.current) {
      console.log('Creating new STOMP client');
      const stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/api/ws'),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          // console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      stompClient.onConnect = () => {
        console.log('WebSocket connected');
        setIsConnected(true);

        // Subscribe to user notifications
        const notificationSub = stompClient.subscribe(
          `/topic/notifications/${userId}`,
          (message) => {
            try {
              const notification: NotificationMessage = JSON.parse(message.body);
              console.log('Notification received:', notification);
              toast.success(notification.message);
              if (onNotificationReceivedRef.current) {
                onNotificationReceivedRef.current(notification);
              }
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          }
        );
        subscriptionsRef.current.set('notifications', notificationSub);
      };

      stompClient.onDisconnect = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      };

      stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        setIsConnected(false);
      };

      clientRef.current = stompClient;
    }

    if (clientRef.current && !clientRef.current.active) {
      console.log('Activating WebSocket client');
      clientRef.current.configure({
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      clientRef.current.activate();
    }

    return () => {
      if (clientRef.current?.active) {
        console.log('Deactivating WebSocket client on cleanup');
        clientRef.current.deactivate();
        subscriptionsRef.current.clear();
        setIsConnected(false);
        clientRef.current = null;
      }
    };
  }, [userId, token]);

  const subscribeToChat = (companyId: number, studentId: number) => {
    if (!clientRef.current || !isConnected) return null;

    const topic = `/topic/messages/${companyId}/${studentId}`;
    const subscriptionKey = `chat-${companyId}-${studentId}`;
    
    const existingSub = subscriptionsRef.current.get(subscriptionKey);
    if (existingSub) {
      existingSub.unsubscribe();
    }

    const subscription = clientRef.current.subscribe(topic, (message) => {
      try {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        console.log('Chat message received:', chatMessage);
        if (onMessageReceivedRef.current) {
          onMessageReceivedRef.current(chatMessage);
        }
      } catch (error) {
        console.error('Error parsing chat message:', error);
      }
    });

    subscriptionsRef.current.set(subscriptionKey, subscription);
    return subscription;
  };

  const unsubscribeFromChat = (companyId: number, studentId: number) => {
    const subscriptionKey = `chat-${companyId}-${studentId}`;
    const subscription = subscriptionsRef.current.get(subscriptionKey);
    
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(subscriptionKey);
    }
  };

  const sendMessage = (companyId: number, studentId: number, content: string) => {
    if (!clientRef.current || !isConnected) {
      toast.error('Not connected to chat server');
      return;
    }

    const message: Omit<ChatMessage, 'timestamp'> = {
      senderId: userId,
      senderName: 'Current User', // This would be populated from user data
      content,
      messageType: 'CHAT',
    };

    try {
      clientRef.current.publish({
        destination: `/app/chat/${companyId}/${studentId}`,
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return {
    isConnected,
    subscribeToChat,
    unsubscribeFromChat,
    sendMessage,
  };
}
