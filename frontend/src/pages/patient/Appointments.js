"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { toast } from "react-toastify"
import { FiClock, FiMapPin } from "react-icons/fi"
import "./PatientStyles.css"

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/patient/appointments`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setAppointments(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching appointments:", err)
        toast.error("Failed to load appointments")
      } finally {
        setLoading(false)
      }
    }

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctor/list`)

        if (response.data.success) {
          setDoctors(response.data.data)
          if (response.data.data.length === 0) {
            toast.info("No doctors available at the moment")
          }
        } else {
          toast.error(response.data.message || "Failed to load doctors list")
        }
      } catch (err) {
        console.error("Error fetching doctors:", err)
        toast.error(err.response?.data?.message || "Failed to load doctors list")
      }
    }

    fetchAppointments()
    fetchDoctors()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")
    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      
      const response = await axios.post(
        `${API_URL}/patient/appointments`,
        { ...formData, date: dateTime },
        { withCredentials: true }
      )

      if (response.data.success) {
        // Find the selected doctor details
        const selectedDoctor = doctors.find(doc => doc._id === formData.doctorId)
        const newAppointment = {
          _id: response.data.data._id,
          doctorName: selectedDoctor ? (selectedDoctor.user?.name || selectedDoctor.name) : '',
          specialization: selectedDoctor ? selectedDoctor.specialization : '',
          department: selectedDoctor ? selectedDoctor.department : '',
          date: dateTime,
          reason: formData.reason,
          status: "Scheduled",
          location: "Main Hospital"
        }
        setAppointments([newAppointment, ...appointments])
        setMessage("Appointment booked successfully!")
        setFormData({
          doctorId: "",
          date: "",
          time: "",
          reason: "",
        })
        setShowModal(false)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to book appointment")
    } finally {
      setSubmitting(false)
    }
  }

  const cancelAppointment = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/patient/appointments/${id}/cancel`, {}, { withCredentials: true })

      if (response.data.success) {
        toast.success("Appointment cancelled successfully")
        setAppointments(
          appointments.map((appointment) =>
            appointment._id === id ? { ...appointment, status: "Cancelled" } : appointment,
          ),
        )
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      toast.error("Failed to cancel appointment")
    }
  }

  if (loading) {
    return <div className="loading">Loading appointments...</div>
  }

  return (
    <div className="patient-appointments">
      <div className="page-header">
        <h2>Book Appointment</h2>
      </div>
      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Doctor</label>
          <select name="doctorId" value={formData.doctorId} onChange={handleChange} required className="form-input">
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>{doc.user?.name || doc.name} ({doc.specialization})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
            className="form-input"
            min={new Date().toISOString().split('T')[0]} // Set minimum date to today
          />
        </div>
        <div className="form-group">
          <label>Time</label>
          <select 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            required 
            className="form-input"
          >
            <option value="">Select time</option>
            {Array.from({ length: 25 }, (_, i) => {
              const hour = Math.floor(i / 2) + 8 // Start from 8 AM
              const minute = i % 2 === 0 ? '00' : '30'
              const time = `${hour.toString().padStart(2, '0')}:${minute}`
              return (
                <option key={time} value={time}>
                  {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </option>
              )
            })}
          </select>
        </div>
        <div className="form-group">
          <label>Reason</label>
          <input type="text" name="reason" value={formData.reason} onChange={handleChange} required className="form-input" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Booking..." : "Book Appointment"}</button>
        {message && <div className="form-message">{message}</div>}
      </form>
      <div className="page-header" style={{ marginTop: 32 }}>
        <h2>Your Appointments</h2>
      </div>
      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length > 0 ? (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card detailed">
              <div className="appointment-date">
                <span className="day">{new Date(appointment.date).getDate()}</span>
                <span className="month">
                  {new Date(appointment.date).toLocaleString("default", { month: "short" })}
                </span>
              </div>
              <div className="appointment-details">
                <h3>Dr. {appointment.doctorName}</h3>
                <p className="department">{appointment.specialization || appointment.department}</p>
                <div className="appointment-info">
                  <div className="info-item">
                    <FiClock />
                    <span>
                      {new Date(appointment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="info-item">
                    <FiMapPin />
                    <span>{appointment.location || "Main Hospital"}</span>
                  </div>
                </div>
                <p className="appointment-reason">
                  <strong>Reason:</strong> {appointment.reason}
                </p>
              </div>
              <div className="appointment-actions">
                <span className={`status-badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                {appointment.status === "Scheduled" && (
                  <button className="btn btn-outline cancel-btn" onClick={() => cancelAppointment(appointment._id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-container">
          <p className="no-data">No appointments found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Book Your First Appointment
          </button>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Book New Appointment</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label htmlFor="doctorId" className="form-label">
                  Select Doctor
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  className="form-input"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time" className="form-label">
                  Time
                </label>
                <select
                  id="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select time</option>
                  {Array.from({ length: 25 }, (_, i) => {
                    const hour = Math.floor(i / 2) + 8 // Start from 8 AM
                    const minute = i % 2 === 0 ? '00' : '30'
                    const time = `${hour.toString().padStart(2, '0')}:${minute}`
                    return (
                      <option key={time} value={time}>
                        {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reason" className="form-label">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  className="form-input"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientAppointments
