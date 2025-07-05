const mongoose = require("mongoose")

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["Medicine", "Equipment", "Supplies", "Other"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
  },
  expiryDate: {
    type: Date,
  },
  reorderLevel: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Inventory", InventorySchema)
