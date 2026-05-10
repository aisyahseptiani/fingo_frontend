// src/lib/auth-client.js - Mock version (tanpa hooks di dalam fungsi biasa)

const STORAGE_KEY = 'mock_user'

// Helper murni - tidak pakai hooks
export const getStoredUser = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')

export const signIn = {
  email: async ({ email, password }) => {
    const user = { id: '1', name: 'Aisyah Septiani', email, jobType: 'Gig Worker' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    window.dispatchEvent(new Event('mock_auth_change'))
    return { data: user, error: null }
  }
}

export const signUp = {
  email: async ({ email, password, name }) => {
    const user = { id: '1', name, email, jobType: 'Gig Worker' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    window.dispatchEvent(new Event('mock_auth_change'))
    return { data: user, error: null }
  }
}

export const signOut = async () => {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('mock_auth_change'))
  return { error: null }
}

// klo backend ada
// import { createAuthClient } from "better-auth/react"
// export const authClient = createAuthClient({ baseURL: "http://localhost:3000" })
// export const { signIn, signUp, signOut, useSession } = authClient