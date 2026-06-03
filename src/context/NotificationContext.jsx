// context/NotificationContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const NotificationContext = createContext(null)

/**
 * Tipe notifikasi yang didukung:
 *  - 'ai_profile'    → Saran AI dari halaman Profil
 *  - 'ai_dashboard'  → Saran AI dari Dashboard
 *  - 'ai_impulse'    → Hasil analisis Impulsive Detector
 *  - 'budget_warning'→ Peringatan budget mendekati / melebihi limit
 */

const DEFAULT_NOTIFICATIONS = []

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('fingo_notifications_list')
      if (saved) return JSON.parse(saved)
    } catch(e) {}
    return DEFAULT_NOTIFICATIONS
  })

  useEffect(() => {
    localStorage.setItem('fingo_notifications_list', JSON.stringify(notifications))
  }, [notifications])

  // Tambah notifikasi baru (duplikat berdasarkan `id` diabaikan)
  const addNotification = useCallback((notif) => {
    try {
      const saved = localStorage.getItem('fingo_notif_settings')
      if (saved) {
        const settings = JSON.parse(saved);
        if (!settings.all) return;
        const typeMap = {
          'ai_profile': 'ai',
          'ai_dashboard': 'ai',
          'ai_impulse': 'impulsif',
          'budget_warning': 'budget'
        }
        const mappedKey = typeMap[notif.type]
        if (mappedKey && settings[mappedKey] === false) {
           return;
        }
      }
    } catch(e) { console.error(e) }

    setNotifications((prev) => {
      if (notif.id && prev.some((n) => n.id === notif.id)) return prev
      return [
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
      ]
    })
  }, [])

  // Tandai satu notifikasi sebagai sudah dibaca
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  // Tandai semua sebagai sudah dibaca
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  // Hapus satu notifikasi
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  // Hapus semua notifikasi
  const clearAll = useCallback(() => setNotifications([]), [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications harus dipakai di dalam NotificationProvider')
  return ctx
}