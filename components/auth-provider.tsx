"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { userAPI } from "@/lib/api"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  isPro?: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem("auth_token")

    if (token) {
      loadUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      const userData = await userAPI.getProfile()
      setUser(userData)
    } catch (error) {
      console.error("Failed to load user profile:", error)
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await userAPI.login(email, password)

      // Store token
      localStorage.setItem("auth_token", response.token)

      // Load user profile
      await loadUserProfile()
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await userAPI.signup(userData)

      // Store token
      localStorage.setItem("auth_token", response.token)

      // Load user profile
      await loadUserProfile()
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
