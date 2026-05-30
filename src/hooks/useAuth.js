// hooks/useAuth.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp, signOut } from '../lib/auth-client'

export function useLogin() {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async ({ email, password }) => {
    setIsPending(true)
    setIsError(false)
    try {
      const { error: err } = await signIn.email({ email, password })
      if (err) throw err
      navigate('/')
    } catch (err) {
      setIsError(true)
      setError(err)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending, isError, error }
}

export function useRegister() {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async ({ name, email, password, jobType }) => {
    setIsPending(true)
    setIsError(false)
    try {
      const { error: err } = await signUp.email({ email, password, name })
      if (err) throw err
      
      // better-auth secara default langsung me-login-kan user setelah signUp.
      // Karena Anda ingin user kembali ke menu login dan login manual, 
      // kita sign out sesi yang baru terbuat tersebut.
      await signOut()
      
      // Opsional: Tampilkan pesan sukses
      alert("Registrasi berhasil! Silakan login menggunakan akun Anda.");
      
      navigate('/login')
    } catch (err) {
      setIsError(true)
      setError(err)
    } finally {
      setIsPending(false)
    }
  }

  return { mutate, isPending, isError, error }
}

export function useLogout() {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)

  const mutate = async () => {
    setIsPending(true)
    await signOut()
    navigate('/login')
    setIsPending(false)
  }

  return { mutate, isPending }
}