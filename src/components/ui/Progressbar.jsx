export default function ProgressBar({ value = 0, max = 100, color = 'blue', showLabel = false }) {
  const percent = Math.min(100, Math.round((value / max) * 100))
  const colors = {
    blue: 'bg-blue-500', green: 'bg-green-500',
    yellow: 'bg-yellow-500', red: 'bg-red-500',
  }
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 ${colors[color]}`} style={{ width: `${percent}%` }}/>
      </div>
      {showLabel && <p className="text-xs text-gray-500 mt-1">{percent}%</p>}
    </div>
  )
}