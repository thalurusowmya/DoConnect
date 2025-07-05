const Appointment = require("../models/Appointment");
const Admission = require("../models/Admission");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Bed = require("../models/Bed");

// @desc    Get all doctors for appointment booking
// @route   GET /api/doctor/list
// @access  Public
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "name email")
      .select("specialization department experience availability");
    
    if (!doctors || doctors.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No doctors found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctors.map(doc => ({
        _id: doc._id,
        name: doc.user?.name || "Unknown Doctor",
        specialization: doc.specialization || "General Medicine",
        department: doc.department || "General",
        experience: doc.experience || 0,
        availability: doc.availability || {
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          startTime: "09:00",
          endTime: "17:00"
        }
      }))
    });
  } catch (err) {
    console.error("Error in getAllDoctors:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors list",
      error: err.message
    });
  }
};

// @desc    Get all appointments for this doctor
// @route   GET /api/doctor/appointments
// @access  Private (Doctor only)
exports.getAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({ path: "patient", populate: { path: "user" } });
    res.status(200).json({
      success: true,
      data: appointments.map(app => ({
        _id: app._id,
        patientName: app.patient?.user?.name || "",
        date: app.date,
        reason: app.reason,
        status: app.status,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all admissions for this doctor
// @route   GET /api/doctor/admissions
// @access  Private (Doctor only)
exports.getAdmissions = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const admissions = await Admission.find({ admittedBy: doctor._id })
      .populate({ path: "patient", populate: { path: "user" } })
      .populate("bed")
      .sort({ admissionDate: -1 });

    res.status(200).json({
      success: true,
      data: admissions.map(adm => ({
        _id: adm._id,
        patientName: adm.patient?.user?.name || "",
        patientId: adm.patient?._id || "",
        bedNumber: adm.bed?.bedNumber || "",
        ward: adm.bed?.ward || "",
        bedType: adm.bed?.type || "",
        admissionDate: adm.admissionDate,
        dischargeDate: adm.dischargeDate,
        diagnosis: adm.diagnosis,
        status: adm.status,
        notes: adm.notes
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all patients for this doctor
// @route   GET /api/doctor/patients
// @access  Private (Doctor only)
exports.getPatients = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Find all appointments for this doctor to get their patients
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({ path: "patient", populate: { path: "user" } })
      .sort({ date: -1 });

    // Get unique patients from appointments
    const uniquePatients = new Map();
    appointments.forEach(app => {
      if (app.patient && !uniquePatients.has(app.patient._id.toString())) {
        uniquePatients.set(app.patient._id.toString(), {
          _id: app.patient._id,
          name: app.patient.user?.name || "",
          age: app.patient.user?.dateOfBirth ? 
            Math.floor((new Date() - new Date(app.patient.user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : "",
          gender: app.patient.user?.gender || "",
          contact: app.patient.user?.phone || "",
          address: app.patient.user?.address || "",
          lastVisit: app.date
        });
      }
    });

    res.status(200).json({
      success: true,
      data: Array.from(uniquePatients.values())
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get doctor dashboard data
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor only)
exports.getDashboard = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });

    // All appointments for this doctor (to get patients and upcoming)
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({ path: "patient", populate: { path: "user" } })
      .sort({ date: -1 });

    // Unique patients
    const uniquePatients = new Map();
    appointments.forEach(app => {
      if (app.patient && !uniquePatients.has(app.patient._id.toString())) {
        uniquePatients.set(app.patient._id.toString(), {
          _id: app.patient._id,
          name: app.patient.user?.name || "",
          age: app.patient.user?.dateOfBirth ? 
            Math.floor((new Date() - new Date(app.patient.user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : "",
          lastVisit: app.date
        });
      }
    });

    // Recent admissions count
    const recentAdmissionsCount = await Admission.countDocuments({ admittedBy: doctor._id, dischargeDate: { $exists: false } });

    // Upcoming appointments (next 5)
    const now = new Date();
    const upcomingAppointments = appointments
      .filter(app => app.date > now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5)
      .map(app => ({
        _id: app._id,
        patientName: app.patient?.user?.name || "",
        date: app.date,
        reason: app.reason,
        status: app.status,
      }));

    // Recent patients (last 5 by last visit)
    const recentPatients = Array.from(uniquePatients.values())
      .sort((a, b) => b.lastVisit - a.lastVisit)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          totalPatients: uniquePatients.size,
          recentAdmissions: recentAdmissionsCount,
        },
        upcomingAppointments,
        recentPatients,
      },
    });
  } catch (err) {
    next(err);
  }
}; 