// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { getStoredUser, signOut } from '../lib/auth-client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handler = () => {
      setUser(getStoredUser())
    }
    window.addEventListener('mock_auth_change', handler)
    return () => window.removeEventListener('mock_auth_change', handler)
  }, [])

  const logout = async () => {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)