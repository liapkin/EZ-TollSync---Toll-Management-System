"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/app/api/axios'

type User = {
  email: string
  name: string
  role: 'admin' | 'operator'
  token: string
  code: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        if (parsed?.code && parsed?.role) {
          setUser(parsed)
        }
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('login/', { email, password })

      const userData = {
        email: data.email || email,
        name: data.name,
        role: data.role.toLowerCase() as 'admin' | 'operator',
        token: data.token,
        code: data.code
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('authToken', data.token)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }

  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
  }

  return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
