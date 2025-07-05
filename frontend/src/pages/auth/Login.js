"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"
import "./Auth.css"

const roles = [
  { label: "Patient", value: "patient", placeholder: "patient@example.com" },
  { label: "Doctor", value: "doctor", placeholder: "doctor@example.com" },
  { label: "Admin", value: "admin", placeholder: "admin@example.com" },
]

const Login = () => {
  const [role, setRole] = useState(() => {
    // Get role from URL query parameter
    const params = new URLSearchParams(window.location.search)
    const roleParam = params.get('role')
    return roleParam || "patient"
  })
  const [email, setEmail] = useState(() => {
    // Set initial email based on role
    const params = new URLSearchParams(window.location.search)
    const roleParam = params.get('role')
    const found = roles.find((r) => r.value === roleParam)
    return found ? found.placeholder : roles[0].placeholder
  })
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const { login, error } = useAuth()
  const navigate = useNavigate()

  const handleRoleChange = (roleValue) => {
    setRole(roleValue)
    const found = roles.find((r) => r.value === roleValue)
    setEmail(found ? found.placeholder : "")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await login(email, password)
      console.log("Login response:", response)

      if (response.success) {
        toast.success("Login successful!")
        console.log("User role:", response.data.role)

        // Redirect based on user role
        switch (response.data.role) {
          case "patient":
            navigate("/patient")
            break
          case "doctor":
            navigate("/doctor")
            break
          case "admin":
            navigate("/admin")
            break
          default:
            navigate("/")
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error(err.response?.data?.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-login-bg">
      <div className="auth-login-logo">
        <span className="auth-login-logo-circle">H</span>
        <Link to="/" className="auth-login-logo-text" style={{ textDecoration: 'none' }}>
          <span className="auth-login-logo-title">DOCONNECT</span>
          <span className="auth-login-logo-sub">HEALTHCARE SERVICES</span>
        </Link>
      </div>
      <div className="auth-login-card">
        <h2 className="auth-login-title">Login</h2>
        <div className="auth-login-subtitle">Enter your credentials to access your account</div>
        <div className="auth-login-tabs">
          {roles.map((r) => (
            <button
              key={r.value}
              className={`auth-login-tab${role === r.value ? " active" : ""}`}
              type="button"
              onClick={() => handleRoleChange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <form className="auth-login-form" onSubmit={handleSubmit}>
          <div className="auth-login-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={roles.find((r) => r.value === role)?.placeholder}
              required
            />
          </div>
          <div className="auth-login-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
            />
          </div>
          <button type="submit" className="auth-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="auth-login-footer">
          Don&apos;t have an account? <Link to="/register" className="auth-login-signup-link">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
