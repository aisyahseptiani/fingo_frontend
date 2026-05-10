// pages/auth/RegisterPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../../hooks/useAuth'
import { validateRegisterForm } from '../../utils/validators'

const JOB_TYPES = ['Gig Worker', 'Freelancer', 'Karyawan', 'Wirausaha', 'Pelajar/Mahasiswa', 'Lainnya']

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', jobType: '', email: '', password: '', confirmPassword: '', agreeTerms: false
  })
  const [errors, setErrors] = useState({})
  const { mutate: register, isPending, isError, error } = useRegister()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateRegisterForm(form)
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Password tidak sama'
    if (!form.agreeTerms) errs.agreeTerms = 'Kamu harus menyetujui syarat & ketentuan'
    if (Object.keys(errs).length) { setErrors(errs); return }
    register({ name: form.name, email: form.email, password: form.password, jobType: form.jobType })
  }

  const inputClass = (field) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-300
    ${errors[field]
      ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10'
    }`

  return (
    <div className="w-full">
      <h1 className="text-3xl font-black text-gray-900 mb-1">Buat akun baru</h1>
      <p className="text-gray-400 text-sm mb-8">Bergabung dengan ribuan gig-worker Indonesia</p>

      {isError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error?.response?.data?.message || 'Pendaftaran gagal. Coba lagi.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama + Tipe Pekerjaan — 2 kolom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Nama Lengkap</label>
            <input
              name="name"
              type="text"
              placeholder="Nama lengkap"
              value={form.name}
              onChange={handleChange}
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Tipe Pekerjaan</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className={`${inputClass('jobType')} bg-white`}
            >
              <option value="">Pilih tipe</option>
              {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            {errors.jobType && <p className="mt-1 text-xs text-red-500">{errors.jobType}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-500 mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Masukkan Alamat Email"
            value={form.email}
            onChange={handleChange}
            className={inputClass('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password + Konfirmasi — 2 kolom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={inputClass('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Konfirmasi</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`${inputClass('confirmPassword')}`}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Checkbox syarat */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded accent-[#22c55e] cursor-pointer"
            />
            <span className="text-sm text-gray-500 leading-relaxed">
              Saya setuju dengan{' '}
              <button type="button" className="text-[#22c55e] font-semibold hover:underline">Syarat & Ketentuan</button>
              {' '}dan{' '}
              <button type="button" className="text-[#22c55e] font-semibold hover:underline">Kebijakan Privasi</button>
              {' '}Fingo.
            </span>
          </label>
          {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
        </div>

        {/* Tombol Daftar */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.99] text-white font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Daftar
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-[#22c55e] font-semibold hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  )
}