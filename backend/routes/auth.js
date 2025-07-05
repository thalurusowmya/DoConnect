const express = require("express")
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth")
const { protect } = require("../middleware/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.post("/logout", protect, logout)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:resettoken", resetPassword)
router.put("/update-details", protect, updateDetails)
router.put("/update-password", protect, updatePassword)

module.exports = router
