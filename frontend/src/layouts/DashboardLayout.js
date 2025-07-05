"use client"

import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiBriefcase,
  FiUsers,
  FiPackage,
  FiMonitor, // Replacing FiBed with FiMonitor
} from "react-icons/fi"
import "./DashboardLayout.css"

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const getNavLinks = () => {
    switch (currentUser?.role) {
      case "patient":
        return [
          { to: "/patient", icon: <FiHome />, label: "Dashboard" },
          { to: "/patient/appointments", icon: <FiCalendar />, label: "Appointments" },
          { to: "/patient/medical-records", icon: <FiFileText />, label: "Medical Records" },
          { to: "/patient/prescriptions", icon: <FiFileText />, label: "Prescriptions" },
          { to: "/patient/billing", icon: <FiDollarSign />, label: "Billing" },
          { to: "/patient/admission", icon: <FiMonitor />, label: "Admission" },
        ]
      case "doctor":
        return [
          { to: "/doctor", icon: <FiHome />, label: "Dashboard" },
          { to: "/doctor/appointments", icon: <FiCalendar />, label: "Appointments" },
          { to: "/doctor/admissions", icon: <FiMonitor />, label: "Admission" },
          { to: "/doctor/patients", icon: <FiUsers />, label: "Patients" },
          { to: "/doctor/prescriptions", icon: <FiFileText />, label: "Prescriptions" },
        ]
      case "admin":
        return [
          { to: "/admin", icon: <FiHome />, label: "Dashboard" },
          { to: "/admin/doctors", icon: <FiBriefcase />, label: "Doctors" },
          { to: "/admin/patients", icon: <FiUsers />, label: "Patients" },
          { to: "/admin/billing", icon: <FiDollarSign />, label: "Billing" },
          { to: "/admin/inventory", icon: <FiPackage />, label: "Inventory" },
          { to: "/admin/bed-management", icon: <FiMonitor />, label: "Bed Management" },
          { to: "/admin/admissions", icon: <FiMonitor />, label: "Admissions" },
        ]
      default:
        return []
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">HMS</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <FiX />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            <FiUser />
          </div>
          <div className="user-info">
            <h3>{currentUser?.name}</h3>
            <p>{currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {getNavLinks().map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className={location.pathname === link.to ? "active" : ""}
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <h1 className="page-title">
            {location.pathname
              .split("/")
              .pop()
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ") || "Dashboard"}
          </h1>
          <div className="header-actions">
            <div className="user-dropdown">
              <span>{currentUser?.name}</span>
              <div className="user-avatar small">
                <FiUser />
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
