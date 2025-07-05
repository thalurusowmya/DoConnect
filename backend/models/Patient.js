const mongoose = require("mongoose")

const PatientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: false,
  },
  allergies: {
    type: [String],
    default: [],
  },
  medicalHistory: {
    type: [String],
    default: [],
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
})

// Virtual for age
PatientSchema.virtual("age").get(function () {
  const today = new Date()
  const birthDate = new Date(this.user.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
})

module.exports = mongoose.model("Patient", PatientSchema)
