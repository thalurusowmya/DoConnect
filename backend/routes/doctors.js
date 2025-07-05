const express = require("express")
const { protect } = require("../middleware/auth")
const Doctor = require("../models/Doctor")
const User = require("../models/User")

const router = express.Router()

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate("user", "name")

    // Format data for frontend
    const formattedDoctors = doctors.map((doctor) => ({
      _id: doctor._id,
      name: doctor.user.name,
      specialization: doctor.specialization,
      department: doctor.department,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      availability: doctor.availability,
    }))

    res.status(200).json({
      success: true,
      data: formattedDoctors,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router;
