"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import axios from "axios"
import { API_URL } from "../../config"

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [, setLoading] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/doctor/appointments`, { withCredentials: true })
      if (response.data.success) {
        setAppointments(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleCancelAppointment = (id) => {
    setSelectedAppointmentId(id)
    setOpen(true)
  }

  const handleConfirmCancel = () => {
    // Implement actual cancellation logic here (API call)
    console.log(`Appointment ${selectedAppointmentId} cancelled`)
    setOpen(false)
    // Optionally, refresh the appointments list
  }

  const handleClose = () => {
    setOpen(false)
  }

  // New: Mark as Completed
  const handleMarkCompleted = async (id) => {
    try {
      await axios.put(`${API_URL}/doctor/appointments/${id}`, { status: "Completed" }, { withCredentials: true })
      await fetchAppointments()
    } catch (err) {
      console.error("Error marking appointment as completed:", err)
    }
  }

  return (
    <div>
      <h2>Appointments</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Reason</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => {
              const dateObj = new Date(appointment.date)
              return (
                <TableRow key={appointment._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {appointment.patientName}
                  </TableCell>
                  <TableCell align="right">{dateObj.toLocaleDateString()}</TableCell>
                  <TableCell align="right">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell align="right">{appointment.reason}</TableCell>
                  <TableCell align="right">
                    {appointment.status === "Completed" ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>Completed</span>
                    ) : appointment.status === "Cancelled" ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>Cancelled</span>
                    ) : (
                      <>
                        <Button variant="contained" color="secondary" onClick={() => handleCancelAppointment(appointment._id)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="contained" 
                          color="success" 
                          style={{ marginLeft: 8 }} 
                          onClick={() => handleMarkCompleted(appointment._id)}
                        >
                          Mark as Completed
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Appointment?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this appointment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleConfirmCancel} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Appointments
