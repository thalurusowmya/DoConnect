"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../config"
import { FiUsers, FiBriefcase, FiDollarSign } from "react-icons/fi"
import { MdBed } from "react-icons/md"
import "./AdminStyles.css"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalRevenue: 0,
    availableBeds: 0,
  })

  const [recentPatients, setRecentPatients] = useState([])
  const [recentDoctors, setRecentDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/dashboard`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setStats(response.data.data.stats)
          setRecentPatients(response.data.data.recentPatients)
          setRecentDoctors(response.data.data.recentDoctors)
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-content">
            <h3>Total Patients</h3>
            <p className="stat-value">{stats.totalPatients}</p>
            <Link to="/admin/patients" className="stat-link">
              View all
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiBriefcase />
          </div>
          <div className="stat-content">
            <h3>Total Doctors</h3>
            <p className="stat-value">{stats.totalDoctors}</p>
            <Link to="/admin/doctors" className="stat-link">
              View all
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
            <Link to="/admin/billing" className="stat-link">
              View details
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <MdBed />
          </div>
          <div className="stat-content">
            <h3>Available Beds</h3>
            <p className="stat-value">{stats.availableBeds}</p>
            <Link to="/admin/bed-management" className="stat-link">
              Manage
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Patients</h2>
            <Link to="/admin/patients" className="view-all">
              View All
            </Link>
          </div>

          {recentPatients.length > 0 ? (
            <div className="patient-list">
              {recentPatients.map((patient) => (
                <div key={patient._id} className="patient-card">
                  <div className="patient-avatar">{patient.user?.name?.charAt(0) || "-"}</div>
                  <div className="patient-details">
                    <h3>{patient.user?.name || "-"}</h3>
                    <p>
                      <span className="patient-id">ID: {patient._id}</span>
                      {patient.user?.dateOfBirth && (
                        <span className="patient-age">{(() => {
                          const dob = new Date(patient.user.dateOfBirth);
                          const ageDifMs = Date.now() - dob.getTime();
                          const ageDate = new Date(ageDifMs);
                          return Math.abs(ageDate.getUTCFullYear() - 1970) + " years";
                        })()}</span>
                      )}
                    </p>
                    <p>Registered: {patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString() : "-"}</p>
                  </div>
                  <Link to={`/admin/patients`} className="btn btn-outline view-btn">
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent patients</p>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Doctors</h2>
            <Link to="/admin/doctors" className="view-all">
              View All
            </Link>
          </div>

          {recentDoctors.length > 0 ? (
            <div className="patient-list">
              {recentDoctors.map((doctor) => (
                <div key={doctor._id} className="patient-card">
                  <div className="patient-avatar">{doctor.user?.name?.charAt(0) || "-"}</div>
                  <div className="patient-details">
                    <h3>{doctor.user?.name || "-"}</h3>
                    <p>{doctor.user?.email || "-"}</p>
                    <p>{doctor.department || "-"}</p>
                  </div>
                  <Link to={`/admin/doctors`} className="btn btn-outline view-btn">
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No recent doctors</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
