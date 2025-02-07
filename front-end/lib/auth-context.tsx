'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type User = {
  username: string
  role: 'operator' | 'admin'
} | null

type AuthContextType = {
  user: User
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      const newUser = { username, role: 'admin' }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    } else if (username === 'operator' && password === 'password') {
      const newUser = { username, role: 'operator' }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

