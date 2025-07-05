"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../config"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setCurrentUser(response.data.data)
        }
      } catch (err) {
        console.log("Not authenticated")
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    try {
      setError("")
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true })

      if (response.data.success) {
        setCurrentUser(response.data.data)
        return response.data
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login")
      throw err
    }
  }

  const register = async (userData) => {
    try {
      setError("")
      const response = await axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true })

      if (response.data.success) {
        return response.data
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register")
      throw err
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
      setCurrentUser(null)
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email })
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request")
      throw err
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password })
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password")
      throw err
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
