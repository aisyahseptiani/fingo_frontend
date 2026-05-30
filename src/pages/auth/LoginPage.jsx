// pages/auth/LoginPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../hooks/useAuth'
import { validateLoginForm } from '../../utils/validators'
import { signIn } from '../../lib/auth-client'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { mutate: login, isPending, isError, error } = useLogin()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateLoginForm(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    login(form)
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <h1 className="text-3xl font-black text-gray-900 mb-1">Selamat datang kembali</h1>
      <p className="text-gray-400 text-sm mb-8">Masuk ke akun Fingo-mu</p>

      {/* Error global */}
      {isError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error?.message || 'Email atau password salah.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm text-gray-500 mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Masukkan Alamat Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all
              placeholder:text-gray-300
              ${errors.email
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10'
              }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-500 mb-1.5">Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all
              placeholder:text-gray-300
              ${errors.password
                ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10'
              }`}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Tombol Masuk */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.99] text-white font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {isPending && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Masuk
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          disabled={isGoogleLoading}
          onClick={async () => {
            setIsGoogleLoading(true);
            try {
              const res = await signIn.social({ 
                provider: 'google',
                callbackURL: 'http://localhost:5173/',
                // Terkadang better-auth meneruskan argumen ekstra ke URL OAuth
                prompt: 'select_account'
              })
              if (res?.error) {
                // Tampilkan error ke UI agar user tahu masalahnya
                console.error("Google login error:", res.error);
                alert("Google Login Error: " + (res.error.message || "Pastikan kredensial Google sudah diatur di backend."));
                setIsGoogleLoading(false);
              }
              // Catatan: Jika sukses, browser akan redirect, tidak perlu set isGoogleLoading(false)
            } catch (err) {
              console.error("Google login failed", err);
              alert("Terjadi kesalahan sistem saat menghubungi backend.");
              setIsGoogleLoading(false);
            }
          }}
          className="w-full py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-gray-700 font-medium text-sm transition-all flex items-center justify-center gap-2"
        >
          {isGoogleLoading ? (
            <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {isGoogleLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
        </button>
      </form>

      {/* Link ke register */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Belum punya akun?{' '}
        <Link to="/register" className="text-[#22c55e] font-semibold hover:underline">
          Daftar gratis
        </Link>
      </p>
    </div>
  )
}