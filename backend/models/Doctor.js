const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: {
    type: String,
    required: [true, "Please provide specialization"],
  },
  qualifications: {
    type: [String],
    required: [true, "Please provide qualifications"],
  },
  experience: {
    type: Number,
    required: [true, "Please provide years of experience"],
  },
  licenseNumber: {
    type: String,
    required: [true, "Please provide license number"],
    unique: true,
  },
  department: {
    type: String,
    required: [true, "Please provide department"],
  },
  consultationFee: {
    type: Number,
    required: [true, "Please provide consultation fee"],
  },
  availability: {
    days: {
      type: [String],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: [true, "Please provide availability days"],
    },
    startTime: {
      type: String,
      required: [true, "Please provide start time"],
    },
    endTime: {
      type: String,
      required: [true, "Please provide end time"],
    },
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Doctor", DoctorSchema)
