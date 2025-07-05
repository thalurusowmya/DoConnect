const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config()

// Debug environment variables
console.log("MongoDB URI:", process.env.MONGODB_URI)
console.log("PORT:", process.env.PORT)
console.log("NODE_ENV:", process.env.NODE_ENV)

// Import routes
const authRoutes = require("./routes/auth")
const patientRoutes = require("./routes/patient")
const doctorRoutes = require("./routes/doctor")
const adminRoutes = require("./routes/admin")

// Create Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/hms")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/patient", patientRoutes)
app.use("/api/doctor", doctorRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/doctors", require("./routes/doctors"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date(),
    message: 'Server is running'
  });
});

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
