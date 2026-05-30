// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signOut } from '../lib/auth-client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession()

  const logout = async () => {
    await signOut()
    window.location.href = '/login'
  }

  // better-auth session.user contains the user info
  const user = session?.user || null

  return (
    <AuthContext.Provider value={{ user, isLoading: isPending, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)