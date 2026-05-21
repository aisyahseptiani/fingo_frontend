import { useState } from 'react'
import {
  ArrowLeft, ChevronRight, User, Bell, Shield,
  Settings, Link, Lock, Smartphone, Clock,
  FileText, BarChart2, List, EyeOff, DollarSign,
  Sliders, Wallet, Plus
} from 'lucide-react'

// ─── Toggle ─────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-[#22c55e]' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  )
}

// ─── SettingRow ──────────────────────────────────────────────────
function SettingRow({ icon: Icon, iconBg = 'bg-gray-100', iconColor = 'text-gray-500', label, desc, onClick, right }) {
  return (
    <div onClick={onClick}
      className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {right ?? <ChevronRight size={16} className="text-gray-300 shrink-0" />}
    </div>
  )
}

// ─── NotifRow ────────────────────────────────────────────────────
function NotifRow({ icon: Icon, iconBg, iconColor, label, desc, checked, onChange, extra }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-xl ${iconBg ?? 'bg-gray-100'} flex items-center justify-center shrink-0`}>
        {Icon && <Icon size={18} className={iconColor ?? 'text-gray-500'} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {extra}
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── SelectRow ───────────────────────────────────────────────────
function SelectRow({ icon: Icon, iconBg, iconColor, label, desc, value, onChange, options }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-xl ${iconBg ?? 'bg-gray-100'} flex items-center justify-center shrink-0`}>
        {Icon && <Icon size={18} className={iconColor ?? 'text-gray-500'} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-[#22c55e] shrink-0">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ─── Field ───────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder, readOnly }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all
          ${readOnly ? 'bg-gray-50 text-gray-400' : 'focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10'}
          placeholder:text-gray-300`} />
    </div>
  )
}

// ─── BackHeader ──────────────────────────────────────────────────
function BackHeader({ onBack, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
        <ArrowLeft size={18} className="text-gray-600" />
      </button>
      <div>
        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// HALAMAN UTAMA PENGATURAN
// ════════════════════════════════════════════════════════════════
function MainSettings({ onNav }) {
  const ITEMS = [
    { key: 'akun',       label: 'Akun',        desc: 'Profil & Informasi',      icon: User,     iconBg: 'bg-blue-100',   iconColor: 'text-blue-600' },
    { key: 'notifikasi', label: 'Notifikasi',   desc: 'Pembaritahuan & Laporan', icon: Bell,     iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { key: 'keamanan',   label: 'Keamanan',     desc: 'Kata sandi & sesi',       icon: Shield,   iconBg: 'bg-green-100',  iconColor: 'text-green-600' },
    { key: 'preferensi', label: 'Preferensi',   desc: 'Tampilan & format',       icon: Settings, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { key: 'integrasi',  label: 'Integrasi',    desc: 'App & layanan',           icon: Link,     iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  ]
  return (
    <div className="p-6">
      <h1 className="text-2xl font-black text-gray-900">Pengaturan</h1>
      <p className="text-gray-400 text-sm mt-0.5 mb-6">Kelola preferensi & keamanan akumnu</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Kategori</h2>
        </div>
        {ITEMS.map(item => (
          <SettingRow key={item.key} icon={item.icon} iconBg={item.iconBg} iconColor={item.iconColor}
            label={item.label} desc={item.desc} onClick={() => onNav(item.key)} />
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// AKUN
// ════════════════════════════════════════════════════════════════
function AkunSettings({ onBack }) {
  const [form, setForm] = useState({
    firstName: 'Aisyah',
    lastName: 'Septiani',
    email: 'aisyah@example.com',
    phone: '1234567890',
    city: 'Pekanbaru',
    province: 'Riau',
    jobType: 'Gig Worker',
    platform: 'Gojek',
  })

  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.value,
    }))

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <BackHeader
        onBack={onBack}
        title="Akun"
        subtitle="Profil & Informasi"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:p-6 space-y-6">

        {/* HEADER */}
        <div className="border-b border-gray-100 pb-5">
          <h2 className="font-bold text-gray-900 text-lg">
            Informasi Profil
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Nama, foto, dan informasi dasar akun
          </p>
        </div>

        {/* PROFILE */}
        <div className="flex items-start gap-4 sm:gap-5">

          {/* FOTO */}
          <div className="shrink-0">
            <div
              className="
                w-20 h-20
                sm:w-24 sm:h-24

                rounded-2xl
                bg-[#1C3829]
              "
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 min-w-0">

            {/* EMAIL */}
              <p
                className="
                  text-xs
                  sm:text-base

                  text-gray-500

                  leading-relaxed
                  break-words

                  mb-3
                "
              >
                aisyah@example.com · Bergabung April 2024
              </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">

              <button
                className="
                  h-8 sm:h-9

                  px-3 sm:px-4

                  rounded-xl

                  bg-[#22c55e]
                  hover:bg-[#16a34a]

                  text-white
                  text-[11px] sm:text-sm
                  font-semibold

                  whitespace-nowrap

                  transition-colors
                "
              >
                Ganti Foto
              </button>

              <button
                className="
                  h-8 sm:h-9

                  px-3 sm:px-4

                  rounded-xl

                  border border-gray-200
                  hover:bg-gray-50

                  text-gray-600
                  text-[11px] sm:text-sm
                  font-semibold

                  whitespace-nowrap

                  transition-colors
                "
              >
                Hapus Foto
              </button>
            </div>

            {/* FORMAT */}
              <p
                className="
                  text-[10px]
                  sm:text-xs

                  text-gray-400

                  mt-3

                  leading-relaxed
                "
              >
                Format: JPG, PNG, WebP · Maks. 5MB · Minimal 200×200px
              </p>
          </div>
        </div>
            

        {/* NAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Nama Depan"
            value={form.firstName}
            onChange={set('firstName')}
          />

          <Field
            label="Nama Belakang"
            value={form.lastName}
            onChange={set('lastName')}
          />
        </div>

        {/* EMAIL & PHONE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field
            label="Email"
            value={form.email}
            onChange={set('email')}
            type="email"
          />

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Nomor Telepon
            </label>

            <div className="flex gap-2">
              <div
                className="
                  px-3 py-3
                  rounded-xl
                  border border-gray-200
                  text-sm text-gray-500
                  bg-gray-50
                  shrink-0
                "
              >
                ID +62
              </div>

              <input
                value={form.phone}
                onChange={set('phone')}
                type="tel"
                className="
                  flex-1 min-w-0
                  px-4 py-3
                  rounded-xl
                  border border-gray-200
                  text-sm
                  outline-none
                  focus:border-[#22c55e]
                  focus:ring-2
                  focus:ring-[#22c55e]/10
                "
              />
            </div>
          </div>
        </div>

        {/* KOTA & PROVINSI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Kota / Domisili
            </label>

            <select
              value={form.city}
              onChange={set('city')}
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-gray-200
                text-sm
                outline-none
                focus:border-[#22c55e]
                focus:ring-2
                focus:ring-[#22c55e]/10
                bg-white
              "
            >
              {[
                'Pekanbaru',
                'Jakarta',
                'Bandung',
                'Surabaya',
                'Medan',
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Provinsi
            </label>

            <select
              value={form.province}
              onChange={set('province')}
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-gray-200
                text-sm
                outline-none
                focus:border-[#22c55e]
                focus:ring-2
                focus:ring-[#22c55e]/10
                bg-white
              "
            >
              {[
                'Riau',
                'DKI Jakarta',
                'Jawa Barat',
                'Jawa Timur',
                'Sumatera Utara',
              ].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* JOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Tipe Pekerjaan
            </label>

            <select
              value={form.jobType}
              onChange={set('jobType')}
              className="
                w-full
                px-4 py-3
                rounded-xl
                border border-gray-200
                text-sm
                outline-none
                focus:border-[#22c55e]
                focus:ring-2
                focus:ring-[#22c55e]/10
                bg-white
              "
            >
              {[
                'Gig Worker',
                'Freelancer',
                'Karyawan',
                'Wirausaha',
              ].map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </div>

          <Field
            label="Platform"
            value={form.platform}
            onChange={set('platform')}
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-2">
          <button
            className="
              w-full
              sm:w-auto
              sm:min-w-[220px]

              px-5 py-3.5

              rounded-2xl

              bg-[#22c55e]
              hover:bg-[#16a34a]

              text-white
              text-sm
              font-bold

              shadow-sm
              hover:shadow-md

              transition-all
              duration-200
            "
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  )
}
// ════════════════════════════════════════════════════════════════
// NOTIFIKASI
// ════════════════════════════════════════════════════════════════
function NotifikasiSettings({ onBack }) {
  const [notifs, setNotifs] = useState({
    all: true,
    impulsif: true,
    budget: true,
    impulsif2: true,
    target: true,
    ai: true,
    keamanan: true,
    promo: true,
  })

  const toggle = (key) =>
    setNotifs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

  const ITEMS = [
    {
      key: 'all',
      label: 'Aktifkan semua notifikasi',
      icon: Bell,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      key: 'impulsif',
      label: 'Peringatan Transaksi Implusif',
      desc: 'Notifikasi real-time saat AI mendeteksi pengeluaran impulsif',
      icon: Shield,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
    },
    {
      key: 'budget',
      label: 'Peringatan Budget Hampir Habis',
      desc: 'Notifikasi saat pengeluaran suatu kategori mendekati atau melewati limit',
      icon: Wallet,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      extra: (
        <select className="hidden sm:block mr-2 px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-500 bg-white">
          <option>80%</option>
          <option>70%</option>
          <option>90%</option>
        </select>
      ),
    },
    {
      key: 'impulsif2',
      label: 'Peringatan Transaksi Implusif',
      desc: 'Notifikasi real-time saat AI mendeteksi pengeluaran impulsif',
      icon: Shield,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
    },
    {
      key: 'target',
      label: 'Update Progress Target',
      desc: 'Notifikasi saat target keuangan mencapai milestone tertentu',
      icon: BarChart2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      key: 'ai',
      label: 'Tips AI Proaktif',
      desc: 'Saran keuangan dari Fingo AI berdasarkan pola transaksi kamu',
      icon: Sliders,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      key: 'keamanan',
      label: 'Aktivitas Keamanan',
      desc: 'Login baru, perubahan password, atau akses mencurigakan',
      icon: Lock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      key: 'promo',
      label: 'Email Promosi & Tips',
      desc: 'Artikel keuangan, tips hemat, dan info fitur baru Fingo',
      icon: FileText,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
    },
  ]

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <BackHeader
        onBack={onBack}
        title="Notifikasi"
        subtitle="Pemberitahuan & Laporan"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* LIST */}
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className="
              flex items-center justify-between
              gap-3

              px-4 sm:px-5
              py-4

              border-b border-gray-100
              last:border-b-0
            "
          >

            {/* LEFT */}
            <div
              className={`
                flex gap-3 min-w-0 flex-1

                items-center

                ${item.desc ? 'sm:items-start' : 'sm:items-center'}
              `}
            >

              {/* ICON */}
              <div
                className={`
                  w-10 h-10
                  rounded-xl
                  flex items-center justify-center
                  shrink-0
                  ${item.iconBg}
                `}
              >
                <item.icon
                  size={18}
                  className={item.iconColor}
                />
              </div>

              {/* TEXT */}
              <div
                className={`
                  min-w-0 flex-1

                  flex items-center
                  sm:block

                  ${!item.desc ? 'sm:flex sm:items-center sm:h-10' : ''}
                `}
              >

                <div>
                  <div
                    className="
                      text-sm
                      sm:text-[15px]

                      font-semibold
                      text-gray-900

                      leading-snug
                    "
                  >
                    {item.label}
                  </div>

                  {/* DESC hanya desktop */}
                  {item.desc && (
                    <p
                      className="
                        hidden sm:block

                        text-sm
                        text-gray-400

                        mt-1
                        leading-relaxed
                      "
                    >
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center shrink-0">

              {item.extra}

              <button
                onClick={() => toggle(item.key)}
                className={`
                  relative
                  w-11 h-6
                  rounded-full
                  transition-colors

                  ${
                    notifs[item.key]
                      ? 'bg-[#22c55e]'
                      : 'bg-gray-300'
                  }
                `}
              >
                <div
                  className={`
                    absolute top-0.5
                    w-5 h-5
                    rounded-full
                    bg-white
                    transition-all

                    ${
                      notifs[item.key]
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    }
                  `}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// KEAMANAN — sub-halaman
// ════════════════════════════════════════════════════════════════
function PasswordPage({ onBack }) {
  const [form, setForm] = useState({ current: '', newPw: '', confirm: '' })
  return (
    <div className="p-6">
      <BackHeader onBack={onBack} title="Keamanan" subtitle="Kata Sandi & Sesi" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-bold text-gray-900">Perbarui Kata Sandi</h2>
          <p className="text-sm text-gray-400">Terakhir diubah 3 bulan lalu — disarankan ganti setiap 90 hari</p>
        </div>
        <Field label="Kata Sandi Saat Ini" value={form.current}
          onChange={e => setForm(p => ({ ...p, current: e.target.value }))} type="password" placeholder="••••••••" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Kata Sandi Baru" value={form.newPw}
            onChange={e => setForm(p => ({ ...p, newPw: e.target.value }))} type="password" placeholder="Minimal 8 karakter" />
          <Field label="Konfirmasi Kata Sandi Baru" value={form.confirm}
            onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} type="password" placeholder="Ulangi kata sandi baru" />
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
          <p className="text-sm text-yellow-700">Tips: Gunakan minimal 12 karakter, campurkan huruf besar, angka, dan simbol. Jangan gunakan kata sandi yang sama di aplikasi lain.</p>
        </div>
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl transition-colors">Perbarui</button>
        </div>
      </div>
    </div>
  )
}

function TwoFAPage({ onBack }) {
  const [method, setMethod] = useState('sms')
  const [enabled, setEnabled] = useState(true)
  return (
    <div className="p-6">
      <BackHeader onBack={onBack} title="Keamanan" subtitle="Kata Sandi & Sesi" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-bold text-gray-900">Atur Autentikasi 2 Faktur</h2>
          <p className="text-sm text-gray-400">Tambah lapisan keamanan ekstra saat login</p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield size={16} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">2FA Aktif</p>
              <p className="text-xs text-gray-400">Akun kamu lebih aman</p>
            </div>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        {/* Metode */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Metode Verifikasi</p>
          <div className="space-y-2">
            {[
              { key: 'sms',   label: 'SMS OTP',         desc: 'Kode dikirim ke nomor HP kamu', icon: Smartphone },
              { key: 'email', label: 'Email OTP',        desc: 'Kode dikirim ke email kamu',    icon: Bell },
              { key: 'app',   label: 'Authenticator App', desc: 'Google Authenticator / Authy',  icon: Shield },
            ].map(m => (
              <div key={m.key} onClick={() => setMethod(m.key)}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${method === m.key ? 'border-[#22c55e] bg-[#22c55e]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${method === m.key ? 'bg-[#22c55e]/15' : 'bg-gray-100'}`}>
                  <m.icon size={16} className={method === m.key ? 'text-[#22c55e]' : 'text-gray-400'} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${method === m.key ? 'border-[#22c55e] bg-[#22c55e]' : 'border-gray-300'}`} />
              </div>
            ))}
          </div>
        </div>
        <button className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl transition-colors">
          Simpan Pengaturan 2FA
        </button>
      </div>
    </div>
  )
}

function SesiAktifPage({ onBack }) {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Chrome di Windows 11',
      info: 'ID Bandung, Indonesia · IP 112.215.xxx.xxx · Sekarang aktif',
      current: true,
    },
    {
      id: 2,
      device: 'Fingo Mobile — Android',
      info: 'ID Bandung, Indonesia · IP 112.215.xxx.xxx · Sekarang aktif',
      current: false,
    },
  ])

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <BackHeader
        onBack={onBack}
        title="Keamanan"
        subtitle="Kata Sandi & Sesi"
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:p-6">

        {/* HEADER */}
        <div
          className="
            flex flex-col
            sm:flex-row sm:items-center sm:justify-between

            gap-4

            border-b border-gray-100
            pb-4 mb-5
          "
        >
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 text-base sm:text-lg">
              Sesi Aktif
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
              Perangkat yang sedang login ke akun Fingo kamu
            </p>
          </div>

          {/* DESKTOP TETAP */}
          <button
            className="
              w-full sm:w-auto

              px-4 py-2

              rounded-xl

              bg-red-50
              border border-red-200

              text-red-500
              text-sm
              font-semibold

              hover:bg-red-100
              transition-colors
            "
          >
            Keluarkan Semua
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">

          {sessions.map((s) => (
            <div
              key={s.id}
              className="
                flex items-start sm:items-center
                gap-3 sm:gap-4

                p-4

                rounded-xl
                border border-gray-100
              "
            >

              {/* ICON */}
              <div
                className="
                  w-10 h-10

                  rounded-xl
                  bg-gray-100

                  flex items-center justify-center

                  shrink-0
                "
              >
                <Smartphone
                  size={18}
                  className="text-gray-500"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">

                <p
                  className="
                    font-semibold
                    text-gray-900

                    text-sm
                    sm:text-sm

                    leading-snug
                  "
                >
                  {s.device}
                </p>

                <p
                  className="
                    text-[11px]
                    sm:text-xs

                    text-gray-400

                    mt-1

                    leading-relaxed
                    break-words
                  "
                >
                  {s.info}
                </p>

                {/* MOBILE BUTTON */}
                <div className="mt-3 sm:hidden">

                  {s.current ? (
                    <span
                      className="
                        inline-flex items-center

                        px-3 py-1.5

                        rounded-xl

                        bg-[#22c55e]/10
                        border border-[#22c55e]

                        text-[#22c55e]
                        text-[11px]
                        font-semibold
                      "
                    >
                      Perangkat Ini
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        setSessions((p) =>
                          p.filter((x) => x.id !== s.id)
                        )
                      }
                      className="
                        px-3 py-1.5

                        rounded-xl

                        bg-red-50
                        border border-red-200

                        text-red-500
                        text-[11px]
                        font-semibold

                        hover:bg-red-100
                        transition-colors
                      "
                    >
                      Keluarkan
                    </button>
                  )}
                </div>
              </div>

              {/* DESKTOP BUTTON */}
              <div className="hidden sm:block shrink-0">
                {s.current ? (
                  <span
                    className="
                      px-3 py-1.5

                      rounded-xl

                      bg-[#22c55e]/10
                      border border-[#22c55e]

                      text-[#22c55e]
                      text-xs
                      font-semibold
                    "
                  >
                    Perangkat Ini
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      setSessions((p) =>
                        p.filter((x) => x.id !== s.id)
                      )
                    }
                    className="
                      px-3 py-1.5

                      rounded-xl

                      bg-red-50
                      border border-red-200

                      text-red-500
                      text-xs
                      font-semibold

                      hover:bg-red-100
                      transition-colors
                    "
                  >
                    Keluarkan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RiwayatAktivitasPage({ onBack }) {
  const LOGS = [
    { label: 'Login berhasil',             desc: 'Chrome · Bandung · Hari ini, 08:42',     status: 'Aman',     color: 'bg-green-100 text-green-700' },
    { label: 'Verifikasi 2FA diminta',     desc: 'iPhone 15 · Bandung · Kemarin, 19:15',   status: 'Aman',     color: 'bg-green-100 text-green-700' },
    { label: 'Percobaan login gagal (3×)', desc: 'Firefox · Jakarta · 3 hari lalu, 02:31', status: 'Diblokir', color: 'bg-red-100 text-red-600' },
    { label: 'Email terverifikasi',        desc: 'aisyah@example.com · 7 hari lalu',       status: 'Sukses',   color: 'bg-green-100 text-green-700' },
    { label: '2FA diaktifkan',             desc: 'Via SMS OTP · 14 hari lalu',             status: 'Sukses',   color: 'bg-green-100 text-green-700' },
  ]
  return (
    <div className="p-6">
      {/* <BackHeader onBack={onBack} title="Keamanan" subtitle="Kata Sandi & Sesi" /> */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="border-b border-gray-100 pb-4 mb-5">
          <h2 className="font-bold text-gray-900">Riwayat Aktivitas Keamanan</h2>
          <p className="text-sm text-gray-400">Log 30 hari terakhir</p>
        </div>
        <div className="divide-y divide-gray-100">
          {LOGS.map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Clock size={15} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{log.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{log.desc}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${log.color}`}>{log.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KeamananSettings({ onBack }) {
  const [subPage, setSubPage] = useState(null)

  if (subPage === 'password')
    return <PasswordPage onBack={() => setSubPage(null)} />

  if (subPage === 'twofa')
    return <TwoFAPage onBack={() => setSubPage(null)} />

  if (subPage === 'sesi')
    return <SesiAktifPage onBack={() => setSubPage(null)} />

  if (subPage === 'riwayat')
    return <RiwayatAktivitasPage onBack={() => setSubPage(null)} />

  const ITEMS = [
    {
      key: 'password',
      label: 'Perbarui Kata Sandi',
      icon: Lock,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      key: 'twofa',
      label: 'Autentikasi 2F',
      icon: Shield,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      key: 'sesi',
      label: 'Sesi Aktif',
      icon: Smartphone,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      key: 'riwayat',
      label: 'Riwayat Aktivitas Keamanan',
      icon: Clock,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="p-4 sm:p-5 lg:p-6">
      <BackHeader
        onBack={onBack}
        title="Keamanan"
        subtitle="Kata Sandi & Sesi"
      />

      {/* SECURITY SCORE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 lg:p-6 mb-4">

        {/* TITLE */}
        <h2 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
          Skor Keamanan Akun
        </h2>

        <p className="text-xs sm:text-sm text-gray-400 mb-5">
          Berdasarkan fitur keamanan yang sudah diaktifkan
        </p>

        {/* CONTENT */}
        <div className="flex items-center gap-4 sm:gap-5">

          {/* SCORE */}
          <div className="relative shrink-0">

            <svg
              viewBox="0 0 36 36"
              className="
                w-[72px] h-[72px]
                sm:w-20 sm:h-20

                -rotate-90
              "
            >
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="3.5"
              />

              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeDasharray="80 100"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg sm:text-xl font-black text-gray-900">
                80
              </span>

              <span className="text-[9px] sm:text-[10px] text-gray-400">
                Skor
              </span>
            </div>
          </div>

          {/* INFO */}
          <div className="min-w-0 flex-1">

            {/* TITLE */}
            <p
              className="
                font-bold
                text-gray-900

                text-sm
                sm:text-base

                leading-snug
              "
            >
              Keamanan Baik —
              <span className="block sm:inline sm:ml-1">
                bisa lebih kuat lagi
              </span>
            </p>

            {/* DESC */}
            <p
              className="
                text-xs
                sm:text-sm

                text-gray-500

                mt-2
                leading-relaxed
              "
            >
              Akun kamu sudah cukup aman, tapi biometrik belum aktif.
            </p>

            {/* STATUS */}
            <div
              className="
                mt-3

                space-y-1
                sm:space-y-0

                sm:flex
                sm:flex-wrap
                sm:gap-x-3
                sm:gap-y-1
              "
            >
              <div className="text-[#22c55e] text-xs sm:text-sm">
                ✓ Password kuat
              </div>

              <div className="text-[#22c55e] text-xs sm:text-sm">
                ✓ 2FA aktif
              </div>

              <div className="text-[#22c55e] text-xs sm:text-sm">
                ✓ Email terverifikasi
              </div>

              <div className="text-yellow-500 text-xs sm:text-sm">
                ⚠ Biometrik belum aktif
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {ITEMS.map((item) => (
          <SettingRow
            key={item.key}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            label={item.label}
            onClick={() => setSubPage(item.key)}
          />
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// PREFERENSI
// ════════════════════════════════════════════════════════════════
function PreferensiSettings({ onBack }) {
  const [prefs, setPrefs] = useState({
    grafik: 'Gelap', perPage: '20',
    formatPendek: true, sembunyiSaldo: true,
    matauang: 'IDR', pemisah: 'Titik (1.000.000)',
  })
  const set = (key) => (val) => setPrefs(p => ({ ...p, [key]: val }))

  return (
    <div className="p-6">
      <BackHeader onBack={onBack} title="Preferensi" subtitle="Tampilan & Format" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Tampilan Data & Dashboard</h2>
          <p className="text-sm text-gray-400">Kustomisasi cara data keuangan ditampilkan</p>
        </div>

        <SelectRow icon={BarChart2} iconBg="bg-blue-100" iconColor="text-blue-600"
          label="Grafik Default Dashboard" desc="Pilih tampilan grafik yang muncul pertama kali di dashboard"
          value={prefs.grafik} onChange={set('grafik')} options={['Gelap','Terang','Otomatis']} />

        <SelectRow icon={List} iconBg="bg-purple-100" iconColor="text-purple-600"
          label="Jumlah Transaksi per Halaman" desc="Tampilkan berapa transaksi per halaman di riwayat"
          value={prefs.perPage} onChange={set('perPage')} options={['10','20','50','100']} />

        <NotifRow icon={DollarSign} iconBg="bg-green-100" iconColor="text-green-600"
          label="Format Nominal Pendek" desc='Tampilkan Rp 1.200.000 sebagai "Rp 1,2 jt" di dashboard'
          checked={prefs.formatPendek} onChange={v => set('formatPendek')(v)} />

        <NotifRow icon={EyeOff} iconBg="bg-gray-100" iconColor="text-gray-600"
          label="Sembunyikan Nominal Saldo" desc='Tampilkan saldo sebagai "•••••" untuk privasi'
          checked={prefs.sembunyiSaldo} onChange={v => set('sembunyiSaldo')(v)} />

        <SelectRow icon={DollarSign} iconBg="bg-yellow-100" iconColor="text-yellow-600"
          label="Mata Uang" desc={null}
          value={prefs.matauang} onChange={set('matauang')} options={['IDR','USD','SGD','MYR']} />

        <SelectRow icon={Sliders} iconBg="bg-orange-100" iconColor="text-orange-600"
          label="Pemisah Nominal" desc={null}
          value={prefs.pemisah} onChange={set('pemisah')} options={['Titik (1.000.000)','Koma (1,000,000)']} />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// INTEGRASI
// ════════════════════════════════════════════════════════════════
function IntegrasiSettings({ onBack }) {
  const [wallets, setWallets] = useState([
    { id: 1, name: 'Gopay',      connected: true },
    { id: 2, name: 'Dana',       connected: true },
    { id: 3, name: 'BCA Mobile', connected: true },
  ])
  const toggle = (id) => setWallets(p => p.map(w => w.id === id ? { ...w, connected: !w.connected } : w))

  return (
    <div className="p-6">
      <BackHeader onBack={onBack} title="Integrasi" subtitle="App & Layanan" />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-3 border-b border-gray-100 pb-5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <Link size={16} className="text-orange-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">E-wallet & Rekening Terhubung</h2>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              Hubungkan akun keuanganmu agar Fingo bisa sinkronisasi transaksi secara otomatis.
              Data selalu aman dan terenkripsi — Fingo hanya punya akses baca, tidak bisa transfer dana.
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-100 mb-5">
          {wallets.map(w => (
            <div key={w.id} className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Wallet size={16} className="text-gray-500" />
              </div>
              <p className="flex-1 font-semibold text-gray-900">{w.name}</p>
              <button onClick={() => toggle(w.id)}
                className={`px-4 py-1.5 rounded-xl border text-sm font-semibold transition-colors ${
                  w.connected
                    ? 'border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/10'
                    : 'bg-[#22c55e] border-[#22c55e] text-white hover:bg-[#16a34a]'
                }`}>
                {w.connected ? 'Terhubung' : 'Hubungkan'}
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-xl transition-colors">
            <Plus size={15} /> Tambah
          </button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const [page, setPage] = useState('main')

  const pages = {
    main:        <MainSettings onNav={setPage} />,
    akun:        <AkunSettings onBack={() => setPage('main')} />,
    notifikasi:  <NotifikasiSettings onBack={() => setPage('main')} />,
    keamanan:    <KeamananSettings onBack={() => setPage('main')} />,
    preferensi:  <PreferensiSettings onBack={() => setPage('main')} />,
    integrasi:   <IntegrasiSettings onBack={() => setPage('main')} />,
  }

  return pages[page] ?? pages.main
}