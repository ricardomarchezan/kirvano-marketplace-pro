import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: string;
  user_id: string;
  type: "affiliation_request" | "affiliation_approved" | "affiliation_rejected" | "new_sale" | "new_referral";
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "created_at">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const storageKey = user ? `notifications_${user.id}` : null;

  // Load notifications from localStorage
  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [storageKey]);

  // Save notifications to localStorage
  useEffect(() => {
    if (storageKey && notifications.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, storageKey]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, "id" | "created_at">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    // Save to the target user's notifications
    const targetStorageKey = `notifications_${notification.user_id}`;
    const existingNotifications = localStorage.getItem(targetStorageKey);
    let targetNotifications: Notification[] = [];
    
    if (existingNotifications) {
      try {
        targetNotifications = JSON.parse(existingNotifications);
      } catch {
        targetNotifications = [];
      }
    }
    
    targetNotifications = [newNotification, ...targetNotifications];
    localStorage.setItem(targetStorageKey, JSON.stringify(targetNotifications));

    // If the notification is for the current user, update state
    if (user && notification.user_id === user.id) {
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, [user]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
