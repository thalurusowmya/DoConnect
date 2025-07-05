"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"
import { FiCalendar, FiUsers, FiFileText, FiClock, FiUserPlus } from "react-icons/fi"
import "./DoctorStyles.css"

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    recentAdmissions: 0,
  })

  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`${API_URL}/doctor/dashboard`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setStats(response.data.data.stats)
          setUpcomingAppointments(response.data.data.upcomingAppointments)
          setRecentPatients(response.data.data.recentPatients)
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
    <div className="doctor-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>Total Appointments</h3>
            <p className="stat-value">{stats.totalAppointments}</p>
            <Link to="/doctor/appointments" className="stat-link">
              View all
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>Total Patients</h3>
            <p className="stat-value">{stats.totalPatients}</p>
            <Link to="/doctor/patients" className="stat-link">
              View all
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiUserPlus />
          </div>
          <div className="stat-content">
            <h3>Recent Admissions</h3>
            <p className="stat-value">{stats.recentAdmissions}</p>
            <Link to="/doctor/admissions" className="stat-link">
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Link to="/doctor/appointments" className="view-all">
              View All
            </Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="appointment-list">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-date">
                    <span className="day">{new Date(appointment.date).getDate()}</span>
                    <span className="month">
                      {new Date(appointment.date).toLocaleString("default", { month: "short" })}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <h3>{appointment.patientName}</h3>
                    <p>{appointment.reason}</p>
                    <div className="appointment-time">
                      <FiClock />
                      <span>
                        {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No upcoming appointments</p>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Patients</h2>
            <Link to="/doctor/patients" className="view-all">
              View All
            </Link>
          </div>

          {recentPatients.length > 0 ? (
            <div className="patient-list">
              {recentPatients.map((patient) => (
                <div key={patient._id} className="patient-card">
                  <div className="patient-avatar">{patient.name.charAt(0)}</div>
                  <div className="patient-details">
                    <h3>{patient.name}</h3>
                    <p>
                      <span className="patient-id">ID: {patient._id.substring(0, 8)}</span>
                      <span className="patient-age">{patient.age} years</span>
                    </p>
                    <p className="last-visit">Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "-"}</p>
                  </div>
                  <Link to={`/doctor/patients/${patient._id}`} className="btn btn-outline view-btn">
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent patients</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
