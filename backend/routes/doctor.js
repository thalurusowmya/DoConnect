const express = require("express")
const { protect, authorize } = require("../middleware/auth")
const { getAdmissions, getAppointments, getAllDoctors, getPatients, getDashboard } = require("../controllers/doctor")

const router = express.Router()

// Public route to get all doctors for appointment booking
router.get("/list", getAllDoctors)

// Protect all routes
router.use(protect)
router.use(authorize("doctor"))

// @desc    Get doctor dashboard data
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor only)
router.get("/dashboard", getDashboard)

// @desc    Get doctor appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor only)
router.get("/appointments", getAppointments)

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id
// @access  Private (Doctor only)
router.put("/appointments/:id", async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const appointment = await require("../models/Appointment").findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    // Only allow doctor who owns the appointment to update
    const Doctor = require("../models/Doctor");
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this appointment" });
    }
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    await appointment.save();
    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: {
        _id: appointment._id,
        status: appointment.status,
        notes: appointment.notes,
      },
    });
  } catch (err) {
    next(err);
  }
})

// @desc    Get doctor's patients
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
router.get("/patients", getPatients)

// @desc    Get patient details
// @route   GET /api/doctor/patients/:id
// @access  Private (Doctor only)
router.get("/patients/:id", async (req, res, next) => {
  try {
    // Mock data for demonstration
    const patientId = req.params.id

    // In a real application, you would fetch the patient from the database
    // For now, we'll return mock data
    const patient = {
      _id: patientId,
      name: "John Smith",
      age: 45,
      gender: "Male",
      phone: "123-456-7890",
      email: "john.smith@example.com",
      address: "123 Main St, Anytown, USA",
      bloodGroup: "O+",
      dateOfBirth: new Date("1978-05-15"),
      emergencyContact: {
        name: "Jane Smith",
        relationship: "Wife",
        phone: "123-456-7891",
      },
      medicalHistory: ["Hypertension", "Type 2 Diabetes"],
      allergies: ["Penicillin"],
      lastVisit: new Date("2023-05-10"),
      appointments: [
        {
          _id: "60d5ec9af682fbd8e84a5201",
          date: new Date("2023-05-20T10:00:00"),
          reason: "Follow-up checkup",
          status: "Scheduled",
          notes: "Patient recovering well from surgery",
        },
        {
          _id: "60d5ec9af682fbd8e84a5210",
          date: new Date("2023-05-10T14:30:00"),
          reason: "Post-operative checkup",
          status: "Completed",
          notes: "Incision healing well, no signs of infection",
        },
        {
          _id: "60d5ec9af682fbd8e84a5211",
          date: new Date("2023-04-25T11:00:00"),
          reason: "Pre-operative consultation",
          status: "Completed",
          notes: "Discussed procedure, risks, and recovery process",
        },
      ],
      medicalRecords: [
        {
          _id: "60d5ec9af682fbd8e84a5230",
          date: new Date("2023-05-10"),
          recordType: "Consultation",
          diagnosis: "Post-operative recovery",
          treatment: "Antibiotics and pain management",
          notes: "Patient recovering well from appendectomy",
        },
        {
          _id: "60d5ec9af682fbd8e84a5231",
          date: new Date("2023-05-05"),
          recordType: "Surgery",
          diagnosis: "Acute appendicitis",
          treatment: "Appendectomy",
          notes: "Procedure went well without complications",
        },
        {
          _id: "60d5ec9af682fbd8e84a5232",
          date: new Date("2023-05-04"),
          recordType: "Lab Test",
          diagnosis: "Elevated white blood cell count",
          treatment: "Referred for surgical consultation",
          notes: "Blood tests indicate infection",
        },
      ],
    }

    res.status(200).json({
      success: true,
      data: patient,
    })
  } catch (err) {
    next(err)
  }
})

// @desc    Get doctor prescriptions
// @route   GET /api/doctor/prescriptions
// @access  Private (Doctor only)
router.get("/prescriptions", async (req, res, next) => {
  try {
    // Mock data for demonstration
    const prescriptions = [
      {
        _id: "60d5ec9af682fbd8e84a5220",
        patientName: "John Smith",
        patientId: "60d5ec9af682fbd8e84a5147",
        date: new Date("2023-05-10"),
        diagnosis: "Post-operative recovery",
        medications: [
          {
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "3 times daily",
            duration: "7 days",
            instructions: "Take with food",
          },
          {
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "As needed",
            duration: "5 days",
            instructions: "Take for pain",
          },
        ],
        notes: "Complete full course of antibiotics",
      },
      {
        _id: "60d5ec9af682fbd8e84a5221",
        patientName: "John Smith",
        patientId: "60d5ec9af682fbd8e84a5147",
        date: new Date("2023-04-25"),
        diagnosis: "Hypertension",
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take in the morning",
          },
        ],
        notes: "Monitor blood pressure regularly",
      },
    ]

    res.status(200).json({
      success: true,
      data: prescriptions,
    })
  } catch (err) {
    next(err)
  }
})

// @desc    Create new prescription
// @route   POST /api/doctor/prescriptions
// @access  Private (Doctor only)
router.post("/prescriptions", async (req, res, next) => {
  try {
    const { patientId, diagnosis, medications, notes } = req.body

    // In a real application, you would save the prescription to the database
    // For now, we'll just return a success response
    res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: {
        _id: "60d5ec9af682fbd8e84a5223",
        patientId,
        diagnosis,
        medications,
        notes,
        date: new Date(),
      },
    })
  } catch (err) {
    next(err)
  }
})

// @desc    Get doctor admissions
// @route   GET /api/doctor/admissions
// @access  Private (Doctor only)
router.get("/admissions", getAdmissions)

module.exports = router
