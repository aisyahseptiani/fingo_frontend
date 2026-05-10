// components/dashboard/StatCard.jsx
export default function StatCard({ title, value, subtitle, subtitleColor = 'text-gray-400', borderColor = 'border-l-gray-300' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${borderColor} p-4 shadow-sm`}>
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-black text-gray-900 mb-1">{value}</p>
      <p className={`text-xs font-medium ${subtitleColor}`}>{subtitle}</p>
    </div>
  )
}