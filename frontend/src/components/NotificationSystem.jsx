
import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  Snackbar,
  Alert,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  CheckCircle,
  Cancel,
  Pending,
  Work,
  Close
} from '@mui/icons-material';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Add new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50
    setUnreadCount(prev => prev + 1);

    // Show snackbar for immediate feedback
    showSnackbar(notification.message, notification.type || 'info');
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Show snackbar
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Hide snackbar
  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    showSnackbar,
    hideSnackbar
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

// Hook for application-specific notifications
export const useApplicationNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyApplicationReceived = (providerName, gigTitle) => {
    addNotification({
      type: 'application_received',
      title: 'New Application Received',
      message: `${providerName} applied for ${gigTitle}`,
      onClick: () => {
        window.location.href = '/clinic/applications';
      }
    });
  };

  const notifyApplicationStatusUpdate = (status, gigTitle) => {
    const type = status === 'accepted' ? 'application_accepted' : 'application_rejected';
    const title = status === 'accepted' ? 'Application Accepted!' : 'Application Update';
    const message = status === 'accepted' 
      ? `Congratulations! Your application for ${gigTitle} has been accepted.`
      : `Your application for ${gigTitle} has been updated.`;

    addNotification({
      type,
      title,
      message,
      onClick: () => {
        window.location.href = '/provider/applications';
      }
    });
  };

  return {
    notifyApplicationReceived,
    notifyApplicationStatusUpdate
  };
};

export default NotificationProvider;
