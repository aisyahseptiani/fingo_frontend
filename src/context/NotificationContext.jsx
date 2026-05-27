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

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'dashboard_ai_1',
    type: 'ai_dashboard',
    title: 'Pengeluaran hiburan naik 23%',
    message: 'Bulan ini kamu menghabiskan Rp 580.000 untuk hiburan — 23% lebih tinggi dari bulan lalu. Pertimbangkan untuk menetapkan batas bulanan.',
    source: 'Dashboard',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'dashboard_ai_2',
    type: 'ai_dashboard',
    title: 'Pemasukan stabil 3 bulan berturut',
    message: 'Kamu berhasil menjaga konsistensi pemasukan selama 3 bulan. Ini saat yang tepat untuk mulai investasi rutin.',
    source: 'Dashboard',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'profile_ai_dana_darurat',
    type: 'ai_profile',
    title: 'Tingkatkan Tabungan Dana Darurat',
    message: 'Dengan pola pemasukanmu yang naik, tambahkan Rp 300.000/bulan ke dana darurat. Target laptop bisa tercapai bulan Juni — 2 bulan lebih cepat dari rencana!',
    source: 'Profil',
    timestamp: new Date().toISOString(),
    read: false,
  },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)

  // Tambah notifikasi baru (duplikat berdasarkan `id` diabaikan)
  const addNotification = useCallback((notif) => {
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