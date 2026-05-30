import { useState, useEffect } from 'react'
import {
  Bell, Check, AlertTriangle, ShoppingCart, Car, Zap,
  Heart, Home, Tv, Music, BookOpen, Shield,
  TrendingUp, Coffee, Utensils
} from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import { useGetTransactions } from '../../hooks/useTransactions'

const formatRp = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0)
const parseNum = (str) => Number(String(str).replace(/\./g, '').replace(/[^0-9]/g, '')) || 0

const AI_PROPORTIONS = {
  'Makanan & Minuman': 0.19, 'Transportasi': 0.10, 'Tagihan': 0.10,
  'Kesehatan': 0.06, 'Kebutuhan Rumah': 0.05, 'Belanja': 0.17,
  'Hiburan': 0.10, 'Hobi & Langganan': 0.015, 'Pendidikan': 0.015,
  'Dana Darurat': 0.15, 'Investasi': 0.05,
}

const CATEGORY_META = {
  'Makanan & Minuman': { icon: Utensils,    bg: 'bg-orange-100',  color: 'text-orange-500'  },
  'Transportasi':      { icon: Car,          bg: 'bg-blue-100',    color: 'text-blue-500'    },
  'Tagihan':           { icon: Zap,          bg: 'bg-yellow-100',  color: 'text-yellow-600'  },
  'Kesehatan':         { icon: Heart,        bg: 'bg-red-100',     color: 'text-red-500'     },
  'Kebutuhan Rumah':   { icon: Home,         bg: 'bg-green-100',   color: 'text-green-600'   },
  'Belanja':           { icon: ShoppingCart, bg: 'bg-purple-100',  color: 'text-purple-500'  },
  'Hiburan':           { icon: Tv,           bg: 'bg-pink-100',    color: 'text-pink-500'    },
  'Hobi & Langganan':  { icon: Music,        bg: 'bg-indigo-100',  color: 'text-indigo-500'  },
  'Pendidikan':        { icon: BookOpen,     bg: 'bg-cyan-100',    color: 'text-cyan-600'    },
  'Dana Darurat':      { icon: Shield,       bg: 'bg-teal-100',    color: 'text-teal-600'    },
  'Investasi':         { icon: TrendingUp,   bg: 'bg-emerald-100', color: 'text-emerald-600' },
}

const COLUMNS = [
  {
    key: 'kebutuhan', title: 'Kebutuhan', pct: 50, icon: Home,
    headerBg: 'bg-green-50', headerBorder: 'border-green-100',
    iconBg: 'bg-[#22c55e]', subtitleColor: 'text-[#22c55e]',
    barColor: 'bg-[#22c55e]', badgeBg: 'bg-[#22c55e]/10', badgeText: 'text-[#22c55e]',
    categories: ['Makanan & Minuman','Transportasi','Tagihan','Kesehatan','Kebutuhan Rumah'],
  },
  {
    key: 'keinginan', title: 'Keinginan', pct: 30, icon: ShoppingCart,
    headerBg: 'bg-orange-50', headerBorder: 'border-orange-100',
    iconBg: 'bg-orange-400', subtitleColor: 'text-orange-500',
    barColor: 'bg-orange-400', badgeBg: 'bg-orange-50', badgeText: 'text-orange-500',
    categories: ['Belanja','Hiburan','Hobi & Langganan','Pendidikan'],
  },
  {
    key: 'tabungan', title: 'Tabungan', pct: 20, icon: TrendingUp,
    headerBg: 'bg-blue-50', headerBorder: 'border-blue-100',
    iconBg: 'bg-blue-500', subtitleColor: 'text-blue-500',
    barColor: 'bg-blue-500', badgeBg: 'bg-blue-50', badgeText: 'text-blue-500',
    categories: ['Dana Darurat','Investasi'],
  },
]

const getStatus = (percent) => {
  if (percent > 100) return { label: 'Over Budget',      color: 'bg-red-100 text-red-600',        bar: 'bg-red-500'    }
  if (percent >= 80)  return { label: 'Mendekati Limit', color: 'bg-yellow-100 text-yellow-600',  bar: 'bg-yellow-400' }
  return                     { label: 'Aman',             color: 'bg-green-100 text-green-600',   bar: 'bg-[#22c55e]'  }
}

const getAIRec = (income) =>
  Object.fromEntries(Object.entries(AI_PROPORTIONS).map(([k, v]) => [k, Math.round(income * v)]))

// ─── BudgetColumn — dipakai di desktop (horizontal) & mobile (vertical) ──
function BudgetColumn({ col, income, values, aiRec, onChange, compact }) {
  const maxBudget = Math.round(income * col.pct / 100)
  const totalUsed = col.categories.reduce((s, c) => s + (values[c] || 0), 0)
  const usedPct   = maxBudget ? Math.round((totalUsed / maxBudget) * 100) : 0
  const isOver    = totalUsed > maxBudget
  const ColIcon   = col.icon

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`px-4 pt-4 pb-3 ${col.headerBg} border-b ${col.headerBorder}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`${compact ? 'w-8 h-8' : 'w-9 h-9'} rounded-xl ${col.iconBg} flex items-center justify-center shrink-0`}>
            <ColIcon size={compact ? 15 : 18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className={`font-black text-gray-900 leading-none ${compact ? 'text-base' : 'text-lg'}`}>
              {col.title}
            </h2>
            <p className={`text-xs font-bold mt-0.5 ${col.subtitleColor}`}>
              {col.pct}% — Rp {formatRp(maxBudget)}
            </p>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg} ${col.badgeText} shrink-0`}>
            {col.pct}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : col.barColor}`}
            style={{ width: `${Math.min(usedPct, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className={`text-[10px] font-semibold ${isOver ? 'text-red-500' : col.subtitleColor}`}>
            Rp {formatRp(totalUsed)} terisi
          </span>
          <span className={`text-[10px] font-semibold ${isOver ? 'text-red-500' : 'text-gray-400'}`}>
            {isOver ? `⚠ Melebihi ${col.pct}%` : `${usedPct}%`}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-2.5">
        {col.categories.map(cat => {
          const meta    = CATEGORY_META[cat]
          const CatIcon = meta?.icon ?? Coffee
          return (
            <div key={cat} className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg ${meta?.bg ?? 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                <CatIcon size={13} className={meta?.color ?? 'text-gray-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-xs leading-tight truncate">{cat}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">AI: Rp {formatRp(aiRec[cat] ?? 0)}</p>
              </div>
              <input
                type="text"
                value={values[cat] === 0 ? '0' : formatRp(values[cat])}
                onChange={e => onChange(cat, parseNum(e.target.value))}
                className="w-20 shrink-0 px-2 py-1.5 rounded-lg border border-gray-200 text-right text-xs font-semibold text-gray-900 outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Progress View ────────────────────────────────────────────────
function ProgressView({ income, savedValues, onReset }) {
  const { addNotification } = useNotifications()
  const { data: rawTransactions = [] } = useGetTransactions()

  // Analisis pengeluaran bulan ini
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const spentPerCategory = {}
  rawTransactions.forEach(t => {
    const d = new Date(t.date)
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (t.type === 'EXPENSE') {
        if (!spentPerCategory[t.category]) spentPerCategory[t.category] = 0
        spentPerCategory[t.category] += t.amount
      }
    }
  })

  const activeItems = Object.entries(savedValues)
    .filter(([, limit]) => limit > 0)
    .map(([cat, limit]) => {
      const spent = spentPerCategory[cat] || 0
      const percent = Math.round((spent / limit) * 100)
      return { cat, limit, spent, percent }
    })

  const warnings  = activeItems.filter(d => d.percent >= 80 && d.percent <= 100)
  const overItems = activeItems.filter(d => d.percent > 100)

  // Otomatis kirim peringatan budget ke notifikasi saat ProgressView pertama kali tampil
  useEffect(() => {
    warnings.forEach(d => {
      addNotification({
        id: `budget_warn_${d.cat}`,  // id statis per kategori → tidak duplikat
        type: 'budget_warning',
        title: `Budget ${d.cat} hampir habis!`,
        message: `Sudah ${d.percent}% terpakai. Sisa Rp ${formatRp(d.limit - d.spent)}. Hati-hati agar tidak melebihi batas.`,
        source: 'Budget Planner',
      })
    })
    overItems.forEach(d => {
      addNotification({
        id: `budget_over_${d.cat}`,  // id statis per kategori → tidak duplikat
        type: 'budget_warning',
        title: `Budget ${d.cat} terlampaui!`,
        message: `Sudah ${d.percent}% dari batas Rp ${formatRp(d.limit)}. Segera kurangi pengeluaran di kategori ini.`,
        source: 'Budget Planner',
      })
    })
  }, [addNotification, warnings.length, overItems.length])

  const Alerts = () => (
    <div className="space-y-2">
      {warnings.map(d => (
        <div key={d.cat} className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
          <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={14} className="text-yellow-600" />
          </div>
          <div>
            <p className="font-bold text-yellow-700 text-sm">Budget {d.cat} hampir habis!</p>
            <p className="text-yellow-600 text-xs mt-0.5">
              Sudah {d.percent}% terpakai. Sisa Rp {formatRp(d.limit - d.spent)}.
            </p>
          </div>
        </div>
      ))}
      {overItems.map(d => (
        <div key={d.cat} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={14} className="text-red-600" />
          </div>
          <div>
            <p className="font-bold text-red-600 text-sm">Budget {d.cat} Terlampaui!</p>
            <p className="text-red-500 text-xs mt-0.5">
              Sudah {d.percent}% dari batas Rp {formatRp(d.limit)}. Segera kurangi.
            </p>
          </div>
        </div>
      ))}
    </div>
  )

  const ProgressCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900 text-sm lg:text-base">
          Progres Budget — {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </h2>
        <span className="text-xs lg:text-sm text-gray-400">Pemasukan: Rp {formatRp(income)}</span>
      </div>
      {COLUMNS.map(col => {
        const colItems = activeItems.filter(d => col.categories.includes(d.cat))
        if (!colItems.length) return null
        const ColIcon  = col.icon
        const colLimit = Math.round(income * col.pct / 100)
        const colSpent = colItems.reduce((s, d) => s + d.spent, 0)
        const colPct   = Math.round((colSpent / colLimit) * 100)
        const colOver  = colSpent > colLimit
        return (
          <div key={col.key} className="mb-6 last:mb-0">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 rounded-lg ${col.iconBg} flex items-center justify-center shrink-0`}>
                <ColIcon size={12} className="text-white" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${col.subtitleColor}`}>
                {col.title} ({col.pct}%)
              </span>
              <span className="text-xs text-gray-400 ml-auto hidden sm:block">
                Rp {formatRp(colSpent)} / Rp {formatRp(colLimit)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colOver ? 'bg-red-100 text-red-600' : `${col.badgeBg} ${col.badgeText}`}`}>
                {colPct}%
              </span>
            </div>
            <div className="space-y-3">
              {colItems.map(d => {
                const meta    = CATEGORY_META[d.cat]
                const CatIcon = meta?.icon ?? Coffee
                const status  = getStatus(d.percent)
                return (
                  <div key={d.cat}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-5 h-5 rounded-md ${meta?.bg ?? 'bg-gray-100'} flex items-center justify-center shrink-0`}>
                        <CatIcon size={11} className={meta?.color ?? 'text-gray-500'} />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{d.cat}</span>
                      <span className="text-xs font-semibold text-gray-800 shrink-0">
                        Rp {formatRp(d.spent)}
                        <span className="text-gray-400 font-normal hidden sm:inline"> / Rp {formatRp(d.limit)}</span>
                      </span>
                    </div>
                    <div className="ml-7">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-500 ${status.bar}`}
                          style={{ width: `${Math.min(d.percent, 100)}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-gray-400">{d.percent}% terpakai</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="px-4 py-4 lg:px-6 lg:py-6 space-y-4 pb-24 lg:pb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-gray-900">
            Budget Planner
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Alokasi anggaran cerdas dengan rekomendasi 50/30/20
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset}
            className="px-3 lg:px-4 py-2 rounded-xl border border-[#22c55e] text-[#22c55e] text-xs lg:text-sm font-semibold hover:bg-[#22c55e]/10 transition-colors">
            Atur Ulang
          </button>
        </div>
      </div>
      {(warnings.length > 0 || overItems.length > 0) && <Alerts />}
      <ProgressCard />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════
export default function BudgetPlannerPage() {
  const [income, setIncome]           = useState(() => {
    const draft = localStorage.getItem('fingo_budget_income_draft')
    const saved = localStorage.getItem('fingo_budget_income')
    return draft || saved || ''
  })
  const [isLoading, setIsLoading]     = useState(false)
  const [showBudget, setShowBudget]   = useState(false)
  const [usedAI, setUsedAI]           = useState(false)

  const incomeNum = parseNum(income)
  const aiRec     = getAIRec(incomeNum)

  const initValues = () => {
    const draft = localStorage.getItem('fingo_budget_values_draft')
    if (draft) return JSON.parse(draft)
    return Object.fromEntries(COLUMNS.flatMap(c => c.categories).map(cat => [cat, 0]))
  }

  const [budgetValues, setBudgetValues] = useState(initValues)
  const [savedValues, setSavedValues]   = useState(() => {
    const saved = localStorage.getItem('fingo_budget_values')
    return saved ? JSON.parse(saved) : {}
  })
  const [savedBudget, setSavedBudget] = useState(() => {
    return !!localStorage.getItem('fingo_budget_values')
  })

  const handleAturBudget = () => {
    if (!incomeNum) return
    setIsLoading(true); setShowBudget(false)
    setSavedBudget(false); setUsedAI(false)
    setBudgetValues(initValues())
    setTimeout(() => { setIsLoading(false); setShowBudget(true) }, 1200)
  }
  const handleUseAI = () => { setBudgetValues({ ...aiRec }); setUsedAI(true) }
  const handleSave  = () => { 
    setSavedValues({ ...budgetValues }); 
    setSavedBudget(true);
    localStorage.setItem('fingo_budget_income', income);
    localStorage.setItem('fingo_budget_values', JSON.stringify(budgetValues));
    localStorage.removeItem('fingo_budget_income_draft');
    localStorage.removeItem('fingo_budget_values_draft');
  }
  const handleReset = () => { 
    setSavedBudget(false); 
    setShowBudget(true);
    localStorage.removeItem('fingo_budget_income');
    localStorage.removeItem('fingo_budget_values');
    localStorage.removeItem('fingo_budget_income_draft');
    localStorage.removeItem('fingo_budget_values_draft');
    setIncome('');
    setBudgetValues(initValues());
  }
  const updateValue = (cat, val) => { 
    setBudgetValues(p => {
      const next = { ...p, [cat]: val }
      localStorage.setItem('fingo_budget_values_draft', JSON.stringify(next))
      return next
    })
    setUsedAI(false) 
  }

  if (savedBudget) {
    return <ProgressView income={incomeNum} savedValues={savedValues} onReset={handleReset} />
  }

  return (
    <div className="px-4 py-4 lg:px-6 lg:py-6 space-y-4 lg:space-y-5 pb-24 lg:pb-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-gray-900">Budget Planner</h1>
          <p className="text-gray-400 text-sm mt-0.5">Alokasi anggaran cerdas dengan rekomendasi 50/30/20</p>
        </div>
      </div>

      {/* Input pemasukan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
        <p className="text-sm text-gray-400 font-medium mb-2">Total Pemasukan</p>
        <div className="flex items-center gap-3 lg:gap-6">
          <input
            type="text"
            value={income ? formatRp(parseNum(income)) : ''}
            onChange={e => { 
              setIncome(e.target.value); 
              localStorage.setItem('fingo_budget_income_draft', e.target.value);
              setShowBudget(false); 
              setSavedBudget(false) 
            }}
            placeholder="0"
            className="flex-1 text-2xl lg:text-3xl font-black text-gray-900 outline-none placeholder:text-gray-300 border-none bg-transparent min-w-0"
          />
          <button
            onClick={handleAturBudget}
            disabled={!incomeNum || isLoading}
            className="px-4 py-2.5 rounded-xl border border-[#22c55e] text-[#22c55e] text-sm font-semibold hover:bg-[#22c55e]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            {isLoading && <span className="w-4 h-4 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />}
            <span className="hidden sm:inline">Atur Budget</span>
            <span className="sm:hidden">Atur</span>
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              <div className="px-4 pt-4 pb-3 bg-gray-50 border-b border-gray-100 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-xl shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full" />
              </div>
              <div className="px-4 py-3 space-y-2.5">
                {[1,2,3].map(j => (
                  <div key={j} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg w-16 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning melebihi porsi */}
      {showBudget && !isLoading && (
        <div className="space-y-2">
          {COLUMNS.map(col => {
            const max   = Math.round(incomeNum * col.pct / 100)
            const total = col.categories.reduce((s, c) => s + (budgetValues[c] || 0), 0)
            if (total <= max) return null
            return (
              <div key={col.key} className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={14} className="text-yellow-600" />
                </div>
                <p className="text-sm text-yellow-700 font-medium">
                  Total {col.title} melebihi batas {col.pct}% — Rp {formatRp(max)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Budget columns
          Desktop: 3 kolom sejajar
          Mobile: stack vertikal satu per satu */}
      {showBudget && !isLoading && (
        <>
          {/* Desktop — 3 kolom */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4">
            {COLUMNS.map(col => (
              <BudgetColumn key={col.key} col={col} income={incomeNum}
                values={budgetValues} aiRec={aiRec} onChange={updateValue} />
            ))}
          </div>

          {/* Mobile — stack */}
          <div className="lg:hidden space-y-4">
            {COLUMNS.map(col => (
              <BudgetColumn key={col.key} col={col} income={incomeNum}
                values={budgetValues} aiRec={aiRec} onChange={updateValue} compact />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 lg:justify-end">
            <button onClick={handleUseAI}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 lg:px-6 py-3 rounded-xl border text-sm font-bold transition-all
                ${usedAI ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' : 'border-gray-200 text-[#22c55e] hover:bg-[#22c55e]/5'}`}>
              {usedAI && <Check size={15} />}
              <span className="hidden sm:inline">Gunakan Rekomendasi Ai</span>
              <span className="sm:hidden">Rekomendasi AI</span>
            </button>
            <button onClick={handleSave}
              className="flex-1 lg:flex-none lg:px-8 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl transition-colors text-sm">
              Simpan
            </button>
          </div>
        </>
      )}
    </div>
  )
}