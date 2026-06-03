// context/NotificationContext.jsx
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import api from '../services/api'
import { useAuthContext } from './AuthContext'
import { useGetProfile } from '../hooks/useProfile'

const NotificationContext = createContext(null)

const DEFAULT_NOTIFICATIONS = []

export function NotificationProvider({ children }) {
  const { user } = useAuthContext();
  const { data: profile } = useGetProfile(user?.id);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  // 1. Sinkronisasi Awal dari Database
  useEffect(() => {
    if (profile?.preferences?.notificationHistory) {
      setNotifications(profile.preferences.notificationHistory);
    }
  }, [profile?.preferences?.notificationHistory]);

  // 2. Fungsi Background Sinkronisasi ke DB
  const syncToDb = useCallback((newList) => {
    if (!user) return;
    // Mengambil profile terbaru agar tidak menimpa settingan lain yang mungkin berubah
    api.get('/user/profile').then(({ data: currentProfile }) => {
      const prefs = currentProfile.preferences || {};
      api.put('/user/profile', {
        preferences: {
          ...prefs,
          notificationHistory: newList
        }
      }).catch(console.error);
    }).catch(console.error);
  }, [user]);

  const profileSettings = profile?.notifications || {};

  // Tambah notifikasi baru
  const addNotification = useCallback((notif) => {
    // Cek preferensi user dari database
    if (profileSettings.all === false) return;
    const typeMap = {
      'ai_profile': 'ai',
      'ai_dashboard': 'ai',
      'ai_impulse': 'impulsif',
      'budget_warning': 'budget'
    };
    const mappedKey = typeMap[notif.type];
    if (mappedKey && profileSettings[mappedKey] === false) return;

    setNotifications((prev) => {
      if (notif.id && prev.some((n) => n.id === notif.id)) return prev;
      
      const newList = [
        {
          id: notif.id ?? `notif_${Date.now()}_${Math.random()}`,
          type: notif.type ?? 'info',
          title: notif.title ?? 'Notifikasi',
          message: notif.message ?? '',
          source: notif.source ?? '',
          timestamp: notif.timestamp ?? new Date().toISOString(),
          read: false,
        },
        ...prev,
      ];
      syncToDb(newList);
      return newList;
    });
  }, [syncToDb, profileSettings]);

  // Tandai satu notifikasi sebagai sudah dibaca
  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      syncToDb(next);
      return next;
    });
  }, [syncToDb]);

  // Tandai semua sebagai sudah dibaca
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      syncToDb(next);
      return next;
    });
  }, [syncToDb]);

  // Hapus satu notifikasi
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      syncToDb(next);
      return next;
    });
  }, [syncToDb]);

  // Hapus semua notifikasi
  const clearAll = useCallback(() => {
    setNotifications([]);
    syncToDb([]);
  }, [syncToDb]);

  const unreadCount = notifications.filter((n) => !n.read).length

  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  }), [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications harus dipakai di dalam NotificationProvider')
  return ctx
}