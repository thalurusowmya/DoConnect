const mongoose = require("mongoose")

const AdmissionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed",
    required: true,
  },
  admittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  admissionDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dischargeDate: {
    type: Date,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Requested", "Pending", "Admitted", "Discharged", "Transferred"],
    default: "Admitted",
  },
  notes: {
    type: String,
  },
})

module.exports = mongoose.model("Admission", AdmissionSchema)
