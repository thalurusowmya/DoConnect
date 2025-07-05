const mongoose = require("mongoose")

const MedicalRecordSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  recordType: {
    type: String,
    enum: ["Consultation", "Lab Test", "Surgery", "Vaccination", "Other"],
    required: true,
  },
  diagnosis: {
    type: String,
  },
  treatment: {
    type: String,
  },
  notes: {
    type: String,
  },
  attachments: [
    {
      name: String,
      fileUrl: String,
      fileType: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("MedicalRecord", MedicalRecordSchema)
