const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const { getDashboard, getProfile, getAllDoctors, getAllPatients, getBedManagement, getAppointments, getAdmissions, createBed, updateBed, deleteBed, dischargeAdmission } = require("../controllers/admin")

const router = express.Router()

// Protect all routes
router.use(protect)
router.use(authorize("admin"))

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get("/dashboard", getDashboard)

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
router.get("/doctors", getAllDoctors)

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin only)
router.get("/patients", getAllPatients)

// @desc    Get billing information
// @route   GET /api/admin/billing
// @access  Private (Admin only)
router.get("/billing", async (req, res, next) => {
  try {
    // Mock data for demonstration
    const billingData = [
      {
        _id: "60d5ec9af682fbd8e84a5170",
        patientName: "John Smith",
        invoiceNumber: "INV-2023-001",
        services: [
          { name: "Consultation", amount: 150 },
          { name: "Blood Test", amount: 100 },
        ],
        totalAmount: 250,
        paymentStatus: "Paid",
        paymentMethod: "Credit Card",
        paymentDate: new Date("2023-05-10"),
        dueDate: new Date("2023-05-20"),
      },
      {
        _id: "60d5ec9af682fbd8e84a5171",
        patientName: "Emily Johnson",
        invoiceNumber: "INV-2023-002",
        services: [
          { name: "Consultation", amount: 150 },
          { name: "X-Ray", amount: 200 },
        ],
        totalAmount: 350,
        paymentStatus: "Pending",
        dueDate: new Date("2023-05-25"),
      },
      {
        _id: "60d5ec9af682fbd8e84a5172",
        patientName: "Michael Brown",
        invoiceNumber: "INV-2023-003",
        services: [
          { name: "Surgery", amount: 2500 },
          { name: "Hospital Stay (2 days)", amount: 1000 },
        ],
        totalAmount: 3500,
        paymentStatus: "Paid",
        paymentMethod: "Insurance",
        paymentDate: new Date("2023-05-15"),
        dueDate: new Date("2023-05-30"),
      },
    ]

    res.status(200).json({
      success: true,
      data: billingData,
    })
  } catch (err) {
    next(err)
  }
})

// @desc    Get inventory information
// @route   GET /api/admin/inventory
// @access  Private (Admin only)
router.get("/inventory", async (req, res, next) => {
  try {
    // Mock data for demonstration
    const inventoryData = [
      {
        _id: "60d5ec9af682fbd8e84a5180",
        name: "Paracetamol",
        category: "Medicine",
        quantity: 500,
        unit: "Tablets",
        unitPrice: 0.5,
        supplier: {
          name: "MedSupply Inc.",
          contact: "123-456-7890",
          email: "info@medsupply.com",
        },
        expiryDate: new Date("2024-05-15"),
        reorderLevel: 100,
        location: "Pharmacy Store",
        lastUpdated: new Date("2023-04-10"),
      },
      {
        _id: "60d5ec9af682fbd8e84a5181",
        name: "Surgical Masks",
        category: "Supplies",
        quantity: 1000,
        unit: "Pieces",
        unitPrice: 0.2,
        supplier: {
          name: "MedEquip Ltd.",
          contact: "234-567-8901",
          email: "info@medequip.com",
        },
        reorderLevel: 200,
        location: "General Store",
        lastUpdated: new Date("2023-04-15"),
      },
      {
        _id: "60d5ec9af682fbd8e84a5182",
        name: "Blood Pressure Monitor",
        category: "Equipment",
        quantity: 20,
        unit: "Pieces",
        unitPrice: 50,
        supplier: {
          name: "MedTech Solutions",
          contact: "345-678-9012",
          email: "info@medtech.com",
        },
        reorderLevel: 5,
        location: "Equipment Room",
        lastUpdated: new Date("2023-04-20"),
      },
    ]

    res.status(200).json({
      success: true,
      data: inventoryData,
    })
  } catch (err) {
    next(err)
  }
})

// @desc    Get bed management information
// @route   GET /api/admin/bed-management
// @access  Private (Admin only)
router.get("/bed-management", getBedManagement)
router.post("/bed-management", createBed)
router.put("/bed-management/:bedId", updateBed)
router.delete("/bed-management/:bedId", deleteBed)

router.get("/profile", getProfile)

router.get("/appointments", getAppointments)
router.get("/admissions", getAdmissions)
router.put("/admissions/:admissionId/discharge", dischargeAdmission)

module.exports = router
