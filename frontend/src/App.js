"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Layout Components
import DashboardLayout from "./layouts/DashboardLayout"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard"
import PatientAppointments from "./pages/patient/Appointments"
import PatientMedicalRecords from "./pages/patient/MedicalRecords"
import PatientPrescriptions from "./pages/patient/Prescriptions"
import PatientBilling from "./pages/patient/Billing"
import PatientAdmission from "./pages/patient/Admission"

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard"
import DoctorAppointments from "./pages/doctor/Appointments"
import DoctorPatients from "./pages/doctor/Patients"
import DoctorPrescriptions from "./pages/doctor/Prescriptions"
import DoctorAdmissions from "./pages/doctor/Admissions"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import AdminDoctors from "./pages/admin/Doctors"
import AdminPatients from "./pages/admin/Patients"
import AdminBilling from "./pages/admin/Billing"
import AdminInventory from "./pages/admin/Inventory"
import AdminBedManagement from "./pages/admin/BedManagement"
import Admissions from "./pages/admin/Admissions"

import LandingPage from "./pages/LandingPage"

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="medical-records" element={<PatientMedicalRecords />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="billing" element={<PatientBilling />} />
            <Route path="admission" element={<PatientAdmission />} />
          </Route>

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="admissions" element={<DoctorAdmissions />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="bed-management" element={<AdminBedManagement />} />
            <Route path="admissions" element={<Admissions />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
