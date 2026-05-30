// components/dashboard/SetupPromptCard.jsx
import { Link } from 'react-router-dom'

export function BudgetSetupCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-[10px] font-bold text-[#22c55e] tracking-widest uppercase mb-1">
        Budget per Kategori
      </p>
      <p className="text-sm text-gray-400 mt-1 mb-4 leading-relaxed">
        Belum ada budget. Atur budget per kategori agar pengeluaranmu lebih terkontrol.
      </p>
      <Link to="/budget">
        <button className="w-full py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold rounded-xl transition-colors">
          Atur Budget Sekarang →
        </button>
      </Link>
    </div>
  )
}

export function IncomePredictorSetupCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-[10px] font-bold text-[#22c55e] tracking-widest uppercase mb-1">
        Prediksi Income Minggu Ini
      </p>
      <p className="text-sm text-gray-400 mt-1 mb-4 leading-relaxed">
        Belum ada data pemasukan. Atur sumber income kamu agar prediksi bisa ditampilkan.
      </p>
      <Link to="/ai/predictor">
        <button className="w-full py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold rounded-xl transition-colors">
          Atur Income Predictor →
        </button>
      </Link>
    </div>
  )
}