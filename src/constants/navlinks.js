// constants/navlinks.js
import { Home, ArrowLeftRight, PieChart, Bot, User } from 'lucide-react'

export const NAV_LINKS = [
  { path: '/',             label: 'Beranda',   icon: Home },
  { path: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { path: '/budget',       label: 'Anggaran',  icon: PieChart },
  { path: '/ai/assistant', label: 'AI',        icon: Bot },
  { path: '/profile',      label: 'Profil',    icon: User },
]