'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useWebSocket } from '@/hooks/use-websocket';
import { useNotificationStore } from '@/store/notification-store';

interface WebSocketContextType {
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
});

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();

  const { isConnected } = useWebSocket({
    userId: user?.id || 0,
    onNotificationReceived: (notification) => {
      // Add notification with unique ID and read status
      addNotification({
        ...notification,
        id: `${Date.now()}-${Math.random()}`,
        read: false,
      });
    },
  });

  return (
    <WebSocketContext.Provider value={{ isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
