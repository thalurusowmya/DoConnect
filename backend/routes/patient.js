const express = require("express")
const {
  getDashboard,
  getAppointments,
  bookAppointment,
  cancelAppointment,
  getMedicalRecords,
  getPrescriptions,
  getBilling,
  getAdmission,
  requestAdmission,
  updateProfile,
  getAvailableBeds,
} = require("../controllers/patient")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// Protect all routes
router.use(protect)
router.use(authorize("patient"))

router.get("/dashboard", getDashboard)
router.get("/appointments", getAppointments)
router.post("/appointments", bookAppointment)
router.put("/appointments/:id/cancel", cancelAppointment)
router.get("/medical-records", getMedicalRecords)
router.get("/prescriptions", getPrescriptions)
router.get("/billing", getBilling)
router.get("/admission", getAdmission)
router.post("/admission/request", requestAdmission)
router.put("/profile", updateProfile)
router.get("/available-beds", getAvailableBeds)

module.exports = router
