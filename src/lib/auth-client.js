import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({ 
    baseURL: "http://localhost:3001" // Sesuaikan dengan port backend Express
})

export const { signIn, signUp, signOut, useSession } = authClient

// Helper murni - agar sesuai dengan struktur sebelumnya (jika ada yang masih butuh getStoredUser)
// Pada real app, disarankan menggunakan useSession dari hook di komponen
export const getStoredUser = () => {
    // Pada better-auth, sesi otomatis dikelola, namun fungsi ini dipertahankan sbg fallback 
    // agar tidak memecahkan UI yang menggunakan getStoredUser() secara sinkron sebelum refactor
    return null; 
}