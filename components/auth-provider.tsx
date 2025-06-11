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
    // Check for existing auth token on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)

      // Check localStorage for token
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (token && userData) {
        // Restore user from localStorage
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Optionally verify token with backend
        try {
          const freshUserData = await userAPI.getProfile()
          setUser(freshUserData)
          localStorage.setItem("user_data", JSON.stringify(freshUserData))
        } catch (error) {
          // If token is invalid, clear storage
          console.log("Token verification failed, clearing auth")
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user_data")
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await userAPI.login(email, password)

      // Store token and user data
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user_data", JSON.stringify(response.user))

      setUser(response.user)
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

      // Store token and user data
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user_data", JSON.stringify(response.user))

      setUser(response.user)
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)

    // Redirect to home page
    window.location.href = "/"
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
