/**
 * Notification context
 * Handles push notifications for PR reviews and alerts
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  // Future: notification preferences, badge count, etc.
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      registerForNotifications();
    }
  }, [isAuthenticated]);

  const registerForNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        // In production, register device token with backend
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Push token:', token);
      }
    } catch (error) {
      console.error('Failed to register for notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
