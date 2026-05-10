// components/layout/BottomNav.jsx
import { Link } from 'react-router-dom'

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-around">
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transaksi</Link>
      <Link to="/budget">Budget</Link>
      <Link to="/profile">Profile</Link>
    </div>
  )
}