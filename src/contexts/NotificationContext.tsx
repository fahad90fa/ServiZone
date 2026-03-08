import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'system' | 'payment' | 'info';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  { id: 'n1', title: 'Booking Confirmed', message: 'Your Deep Home Cleaning has been confirmed for Mar 10.', time: '5 min ago', read: false, type: 'booking' },
  { id: 'n2', title: 'Payment Received', message: 'Payment of ₹1,499 received for booking #b1.', time: '10 min ago', read: false, type: 'payment' },
  { id: 'n3', title: 'New Job Available', message: 'A new Pest Treatment job is available in your area.', time: '1 hr ago', read: false, type: 'booking' },
  { id: 'n4', title: 'Service Completed', message: 'Your AC Repair has been marked as completed. Please rate the service.', time: '2 hrs ago', read: true, type: 'booking' },
  { id: 'n5', title: 'Welcome to ServiZone!', message: 'Start browsing our services and book your first appointment.', time: '1 day ago', read: true, type: 'system' },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'read'>) => {
    setNotifications(prev => [{ ...n, id: `n${Date.now()}`, read: false }, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
