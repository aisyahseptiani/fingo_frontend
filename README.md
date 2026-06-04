# Fingo — Aplikasi Manajemen Keuangan Pribadi

Tampilkan lebih banyak6:21 PMClaude merespons: Fingo adalah platform keuangan berbasis AI yang dirancang untuk membantu gig worker, freelancer, pekerja informal, dan Generasi Z mengelola pendapatan yang tid…Fingo adalah platform keuangan berbasis AI yang dirancang untuk membantu gig worker, freelancer, pekerja informal, dan Generasi Z mengelola pendapatan yang tidak menentu. Platform ini menghadirkan Income Predictor berbasis machine learning untuk memprediksi pendapatan mingguan, Impulsive Transaction Detector untuk mengidentifikasi pola pengeluaran berisiko, Fingo AI Assistant berbasis Gemini API, dan Budget Planner adaptif.

---

## Fitur Utama

- **Dashboard** — Ringkasan keuangan real-time: total pemasukan, pengeluaran, saldo, serta grafik mingguan/bulanan.
- **Catat Transaksi** — Catat transaksi pemasukan & pengeluaran dengan kategori.
- **Riwayat Transaksi** — Lihat riwayat transaksi pemasukan & pengeluaran dengan kategori.
- **Budget Planner** — Rencanakan anggaran bulanan per kategori dan pantau kegunaannya.
- **AI Assistant** — Chatbot keuangan berbasis AI untuk menjawab pertanyaan seputar keuangan pribadi.
- **Impulsive Detector** — Deteksi pola pengeluaran impulsif menggunakan analisis AI.
- **Income Predictor** — Prediksi pendapatan ke depan berdasarkan data historis transaksi.
- **Notifikasi** — Saran dan peringatan keuangan otomatis.
- **Profil & Pengaturan** — Kelola data pengguna, preferensi, dan tema tampilan.
- **Autentikasi** — Sistem login dan register yang aman menggunakan `better-auth`.

---

## Tech Stack

### Frontend
| Teknologi | Keterangan |
|---|---|
| [React 19](https://react.dev/) | Library UI utama |
| [Vite 8](https://vitejs.dev/) | Build tool & dev server |
| [React Router DOM v7](https://reactrouter.com/) | Client-side routing |
| [TanStack Query v5](https://tanstack.com/query) | Data fetching & caching |
| [Recharts](https://recharts.org/) | Visualisasi grafik keuangan |
| [Tailwind CSS v3](https://tailwindcss.com/) | Styling utility-first |
| [Lucide React](https://lucide.dev/) | Ikon UI |
| [Axios](https://axios-http.com/) | HTTP client |

### Backend (API terintegrasi)
| Teknologi | Keterangan |
|---|---|
| [Express.js v5](https://expressjs.com/) | Server API |
| [Prisma ORM v7](https://www.prisma.io/) | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | Database utama |
| [better-auth](https://www.better-auth.com/) | Autentikasi session-based |

### Deployment
| Platform | Keterangan |
|---|---|
| [Vercel](https://vercel.com/) | Hosting frontend + serverless API |

---

## Struktur Proyek

```
fingo_frontend/
├── api/                        # Backend Express (serverless-ready)
│   ├── controllers/            # Logic handler tiap endpoint
│   ├── routes/                 # Definisi route API
│   ├── middleware/             # Middleware autentikasi, dsb.
│   ├── lib/                    # Konfigurasi (auth, prisma client)
│   └── index.js                # Entry point server
├── prisma/
│   └── schema.prisma           # Skema database (User, Transaction, Goal, dst.)
├── src/
│   ├── assets/                 # Gambar & aset statis
│   ├── components/
│   │   ├── dashboard/          # Komponen kartu statistik, grafik, tabel
│   │   ├── layout/             # MainLayout, AuthLayout, Sidebar, Navbar
│   │   └── ui/                 # Komponen UI reusable (button, modal, dsb.)
│   ├── context/                # React Context (Auth, Theme, Notification, Transaction)
│   ├── hooks/                  # Custom hooks (useProfile, useDashboard, dsb.)
│   ├── pages/
│   │   ├── auth/               # LoginPage, RegisterPage
│   │   ├── dashboard/          # DashboardPage
│   │   ├── transaction/        # TransactionHistoryPage, AddTransactionPage
│   │   ├── budget/             # BudgetPlannerPage
│   │   ├── ai/                 # AIAssistantPage, ImpulsiveDetectorPage, IncomePredictorPage
│   │   ├── notification/       # NotificationPage
│   │   └── profile/            # ProfilePage, SettingsPage
│   ├── routes/                 # AppRoutes, ProtectedRoute, PublicRoute
│   ├── services/               # Fungsi pemanggilan API
│   ├── utils/                  # Helper (formatRupiah, formatDate, dsb.)
│   ├── constants/              # Konstanta kategori, dsb.
│   ├── lib/                    # Konfigurasi library (axios instance, dsb.)
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point React
├── public/                     # Asset publik (favicon, icons)
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                 # Konfigurasi deploy Vercel
└── package.json
```

---

## Instalasi & Menjalankan Proyek

### Prasyarat

Pastikan sudah terinstal:
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [npm](https://www.npmjs.com/) v9 atau lebih baru
- [PostgreSQL](https://www.postgresql.org/) (database lokal atau cloud, misal: Supabase / Neon)

### 1. Clone Repository

```bash
git clone https://github.com/aisyahseptiani/fingo_frontend.git
cd fingo_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di root proyek, lalu isi dengan variabel berikut:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Better-Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:5173"

# Vite (exposed ke frontend)
VITE_API_URL="http://localhost:3001"
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate dev --name init
```

### 5. Jalankan Aplikasi

```bash
# Jalankan frontend & backend sekaligus
npm run dev
```

Aplikasi akan berjalan di:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## Scripts yang Tersedia

| Script | Perintah | Keterangan |
|---|---|---|
| `dev` | `npm run dev` | Jalankan frontend + backend bersamaan |
| `dev:frontend` | `npm run dev:frontend` | Jalankan Vite dev server saja |
| `dev:backend` | `npm run dev:backend` | Jalankan Express API server saja |
| `build` | `npm run build` | Build untuk production |
| `preview` | `npm run preview` | Preview hasil build |
| `lint` | `npm run lint` | Jalankan ESLint |

---

## 🗄️ Skema Database

Proyek menggunakan **PostgreSQL** dengan Prisma ORM. Model utama:

- **User** — Data pengguna (nama, email, profil, preferensi)
- **Transaction** — Transaksi keuangan (pemasukan/pengeluaran, kategori, nominal, tanggal)
- **Goal** — Target tabungan/tujuan keuangan
- **Session** & **Account** — Manajemen sesi autentikasi (dikelola `better-auth`)

---

## Deploy ke Vercel

Proyek ini sudah dikonfigurasi untuk deploy ke Vercel melalui `vercel.json`. Semua request ke `/api/*` akan diteruskan ke `api/index.js` sebagai serverless function.

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Tambahkan semua environment variables di **Vercel Dashboard → Settings → Environment Variables**

---

## Autentikasi

Fingo menggunakan [better-auth](https://www.better-auth.com/) untuk sistem autentikasi berbasis session/cookie. Fitur yang didukung:
- Register akun baru
- Login dengan email & password
- Session management otomatis
- Protected routes (redirect ke `/login` jika belum autentikasi)

---

