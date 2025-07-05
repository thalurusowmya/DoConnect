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

const specialties = [
  "Bariatric Surgery", "Cardiology", "Critical Care", "CT Surgery", "Dermatology", 
  "Emergency Services", "Endocrinology", "ENT", "Gastroenterology", "General Medicine", 
  "Gynaecology", "Hematology & BMT", "Interventional Radiology", "Kidney Transplant", 
  "Liver Transplant", "Lung Transplant", "Mother & Child", "Movement Disorders", 
  "Multiorgan Transplant", "Nephrology", "Neurology", "Nuclear Medicine", "Oncology", 
  "Ophthalmology", "Orthopedics", "Pain Medicine", "Pediatrics", "Physiotherapy",
  "Plastic Surgery", "Pulmonology", "Radiology", "Rheumatology", "Robotic Science", "Spine Surgery",
  "Sports Medicine", "Surgical Gastroenterology", "Urology", "Vascular Surgery"
]

const Register = () => {
  const [role, setRole] = useState("patient")
  const [formData, setFormData] = useState({
    name: "",
    email: roles[0].placeholder,
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    specialization: "",
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRoleChange = (roleValue) => {
    setRole(roleValue)
    const found = roles.find((r) => r.value === roleValue)
    setFormData((prev) => ({ ...prev, email: found ? found.placeholder : "" }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const response = await register({ ...formData, role })

      if (response.success) {
        toast.success("Registration successful! Please login.")
        navigate("/login")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register")
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
        <h2 className="auth-login-title">Sign Up</h2>
        <div className="auth-login-subtitle">Create your account to get started</div>
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
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="auth-login-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={roles.find((r) => r.value === role)?.placeholder}
              required
            />
          </div>
          <div className="auth-login-form-group">
            <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              placeholder="Password"
                required
              />
            </div>
          <div className="auth-login-form-group">
            <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              placeholder="Confirm Password"
                required
              />
          </div>
          <div className="auth-login-form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
          </div>
          <div className="auth-login-form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />
          </div>
          <div className="auth-login-form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          {role === "doctor" && (
            <div className="auth-login-form-group">
              <label>Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select your specialization</option>
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button type="submit" className="auth-login-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="auth-login-footer">
          Already have an account? <Link to="/login" className="auth-login-signup-link">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
