import { createAuthClient } from "better-auth/react"

const backendURL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
  : window.location.origin;

export const authClient = createAuthClient({ 
    baseURL: backendURL // Menggunakan environment variable untuk production
})

export const { signIn, signUp, signOut, useSession } = authClient

// Helper murni - agar sesuai dengan struktur sebelumnya (jika ada yang masih butuh getStoredUser)
// Pada real app, disarankan menggunakan useSession dari hook di komponen
export const getStoredUser = () => {
    // Pada better-auth, sesi otomatis dikelola, namun fungsi ini dipertahankan sbg fallback 
    // agar tidak memecahkan UI yang menggunakan getStoredUser() secara sinkron sebelum refactor
    return null; 
}