const mongoose = require("mongoose")

const BedSchema = new mongoose.Schema({
  bedNumber: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["General", "Semi-Private", "Private", "ICU", "Emergency"],
    required: true,
  },
  ward: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Reserved", "Occupied", "Maintenance"],
    default: "Available",
  },
  price: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model("Bed", BedSchema)
