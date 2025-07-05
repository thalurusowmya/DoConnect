"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"
import { FiCalendar, FiFileText, FiDollarSign, FiHome, FiUserPlus } from "react-icons/fi"
import "./PatientStyles.css"

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    admissionStatus: "None",
  })

  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentAdmissions, setRecentAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`${API_URL}/patient/dashboard`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setStats({
            upcomingAppointments: response.data.data.stats.upcomingAppointments,
            admissionStatus: response.data.data.stats.admissionStatus,
          })
          setRecentAppointments(response.data.data.recentAppointments)
          setRecentAdmissions(response.data.data.recentAdmissions)
        } else {
          setError("Failed to fetch dashboard data")
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Only show admitted status admissions
  const admittedAdmissions = recentAdmissions.filter(adm => adm.status === "Admitted")

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="patient-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>Upcoming Appointments</h3>
            <p className="stat-value">{stats.upcomingAppointments}</p>
            <Link to="/patient/appointments" className="stat-link">
              View all
            </Link>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiHome />
          </div>
          <div className="stat-content">
            <h3>Admission Status</h3>
            <p className="stat-value">{stats.admissionStatus}</p>
            <Link to="/patient/admission" className="stat-link">
              Details
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Appointments</h2>
            <Link to="/patient/appointments" className="view-all">
              View All
            </Link>
          </div>

          {recentAppointments.length > 0 ? (
            <div className="appointment-list">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-date">
                    <span className="day">{new Date(appointment.date).getDate()}</span>
                    <span className="month">
                      {new Date(appointment.date).toLocaleString("default", { month: "short" })}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <h3>{appointment.doctorName}</h3>
                    <p>{appointment.department}</p>
                    <p className="appointment-time">
                      {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent appointments</p>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Admissions</h2>
            <Link to="/patient/admission" className="view-all">
              View All
            </Link>
          </div>

          {admittedAdmissions.length > 0 ? (
            <div className="admission-grid">
              {admittedAdmissions.map((adm) => (
                <div key={adm._id} className="admission-card">
                  <div className="admission-header">
                    <FiUserPlus className="admission-icon" />
                    <div>
                      <h3>{adm.doctorName}</h3>
                      <span className="admission-date">{new Date(adm.admissionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="admission-details">
                    <p><strong>Diagnosis:</strong> {adm.diagnosis}</p>
                    <p><strong>Bed:</strong> {adm.bed} <span style={{marginLeft:8}}><strong>Ward:</strong> {adm.ward}</span></p>
                    <p><strong>Status:</strong> <span className={`status-badge ${adm.status.toLowerCase()}`}>{adm.status}</span></p>
                    {adm.notes && <p><strong>Notes:</strong> {adm.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No current admissions</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
