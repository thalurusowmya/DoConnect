const mongoose = require("mongoose")

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Please provide appointment date and time"],
  },
  reason: {
    type: String,
    required: [true, "Please provide reason for appointment"],
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled", "No-Show"],
    default: "Scheduled",
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Appointment", AppointmentSchema)
