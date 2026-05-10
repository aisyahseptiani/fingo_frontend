// components/ui/Alert.jsx
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'

const config = {
  danger:  { bg: 'bg-red-50 border-red-200',    text: 'text-red-700',   icon: XCircle },
  success: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: CheckCircle },
  warning: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', icon: AlertCircle },
  info:    { bg: 'bg-blue-50 border-blue-200',   text: 'text-blue-700',  icon: Info },
}

export default function Alert({ variant = 'info', children, dismissible = false, className = '' }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const { bg, text, icon: Icon } = config[variant]

  return (
    <div className={`flex items-start gap-2.5 border rounded-lg px-3 py-3 text-sm ${bg} ${text} ${className}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="flex-1">{children}</span>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="shrink-0 hover:opacity-70">
          <X size={14} />
        </button>
      )}
    </div>
  )
}