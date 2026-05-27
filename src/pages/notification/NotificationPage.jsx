// pages/notification/NotificationPage.jsx
import { Bell, BrainCircuit, ShieldAlert, TrendingUp, Zap, Trash2, CheckCheck, X } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

// ──────────────────────────────────────────────
// Config tampilan per tipe notifikasi
// ──────────────────────────────────────────────
const TYPE_CONFIG = {
  ai_profile: {
    icon: TrendingUp,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-600 border border-blue-100',
    label: 'Saran AI — Profil',
    borderAccent: 'border-l-blue-500',
  },
  ai_dashboard: {
    icon: BrainCircuit,
    iconBg: 'bg-green-100',
    iconColor: 'text-[#22c55e]',
    badge: 'bg-green-50 text-[#22c55e] border border-green-100',
    label: 'Saran AI — Dashboard',
    borderAccent: 'border-l-[#22c55e]',
  },
  ai_impulse: {
    icon: Zap,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    badge: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
    label: 'Impulsive Detector',
    borderAccent: 'border-l-yellow-400',
  },
  budget_warning: {
    icon: ShieldAlert,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    badge: 'bg-red-50 text-red-500 border border-red-100',
    label: 'Peringatan Budget',
    borderAccent: 'border-l-red-500',
  },
  info: {
    icon: Bell,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500',
    badge: 'bg-gray-50 text-gray-500 border border-gray-100',
    label: 'Informasi',
    borderAccent: 'border-l-gray-400',
  },
}

function timeAgo(isoString) {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000
  if (diff < 60)   return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return `${Math.floor(diff / 86400)} hari lalu`
}

// ──────────────────────────────────────────────
// Satu kartu notifikasi
// ──────────────────────────────────────────────
function NotifCard({ notif, onRead, onRemove }) {
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.info
  const Icon = cfg.icon

  return (
    <div
      className={`relative bg-white rounded-2xl border border-gray-100 border-l-4 ${cfg.borderAccent} shadow-sm px-4 py-4 flex gap-3 transition-all ${
        !notif.read ? 'ring-1 ring-gray-100' : 'opacity-80'
      }`}
    >
      {/* Dot unread */}
      {!notif.read && (
        <span className="absolute top-3.5 right-10 w-2 h-2 rounded-full bg-[#22c55e]" />
      )}

      {/* Icon */}
      <div className={`shrink-0 w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center mt-0.5`}>
        <Icon size={18} className={cfg.iconColor} />
      </div>

      {/* Konten */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${cfg.badge}`}>
              {cfg.label}
            </span>
            <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
            <p className="text-[10px] text-gray-300 mt-1.5">{timeAgo(notif.timestamp)}</p>
          </div>
          <button
            onClick={() => onRemove(notif.id)}
            className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-300 hover:text-gray-500 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tombol tandai dibaca */}
        {!notif.read && (
          <button
            onClick={() => onRead(notif.id)}
            className="mt-2 text-[11px] text-[#22c55e] font-semibold hover:underline"
          >
            Tandai sudah dibaca
          </button>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// Halaman utama
// ──────────────────────────────────────────────
export default function NotificationPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotifications()

  const isEmpty = notifications.length === 0

  return (
    <div className="px-4 py-4 lg:px-6 lg:py-6 space-y-5 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notifikasi</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>

        {!isEmpty && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] text-xs font-semibold hover:bg-[#22c55e]/20 transition-colors"
              >
                <CheckCheck size={13} />
                Baca Semua
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 size={13} />
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      {/* Filter legend */}
      {!isEmpty && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_CONFIG).slice(0, 4).map(([key, cfg]) => {
            const count = notifications.filter((n) => n.type === key).length
            if (count === 0) return null
            return (
              <span key={key} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                {cfg.label} ({count})
              </span>
            )
          })}
        </div>
      )}

      {/* List notifikasi */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Bell size={28} className="text-gray-300" />
          </div>
          <h2 className="text-base font-bold text-gray-700 mb-1">Tidak ada notifikasi</h2>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            Notifikasi dari Saran AI, Impulsive Detector, dan peringatan budget akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotifCard
              key={n.id}
              notif={n}
              onRead={markAsRead}
              onRemove={removeNotification}
            />
          ))}
        </div>
      )}
    </div>
  )
}