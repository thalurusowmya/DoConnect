const Admin = require("../models/Admin")
const User = require("../models/User")
const Doctor = require("../models/Doctor")
const Patient = require("../models/Patient")
const Bed = require("../models/Bed")
const Appointment = require("../models/Appointment")
const Admission = require("../models/Admission")

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboard = async (req, res, next) => {
  try {
    // Fetch actual counts from the database
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const availableBeds = await Bed.countDocuments({ status: "Available" });

    const stats = {
      totalPatients,
      totalDoctors,
      totalRevenue: 1250, // You can update this to fetch real revenue if needed
      availableBeds,
    };

    // Fetch 3 most recent patients
    const recentPatients = await Patient.find().populate('user').sort({ registrationDate: -1 }).limit(3);
    // Fetch 3 most recent doctors
    const recentDoctors = await Doctor.find().populate('user').sort({ joinDate: -1 }).limit(3);

    res.status(200).json({
      success: true,
      data: {
        stats,
        recentPatients,
        recentDoctors,
      },
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ user: req.user.id }).populate("user")
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin profile not found" })
    }
    res.status(200).json({ success: true, data: admin })
  } catch (err) {
    next(err)
  }
}

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate("user");
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin only)
exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().populate("user");
    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bed management information
// @route   GET /api/admin/bed-management
// @access  Private (Admin only)
exports.getBedManagement = async (req, res, next) => {
  try {
    // Fetch all beds from the database
    const beds = await Bed.find();
    res.status(200).json({
      success: true,
      data: beds,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all appointments (admin)
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate({ path: "patient", populate: { path: "user" } })
      .populate({ path: "doctor", populate: { path: "user" } });
    res.status(200).json({
      success: true,
      data: appointments.map(app => ({
        _id: app._id,
        patientName: app.patient?.user?.name || "",
        doctorName: app.doctor?.user?.name || "",
        date: app.date,
        reason: app.reason,
        status: app.status,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all admissions (admin)
// @route   GET /api/admin/admissions
// @access  Private (Admin only)
exports.getAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find()
      .populate({ path: "patient", populate: { path: "user" } })
      .populate({ path: "admittedBy", populate: { path: "user" } })
      .populate("bed");
    res.status(200).json({
      success: true,
      data: admissions.map(adm => ({
        _id: adm._id,
        patientName: adm.patient?.user?.name || "",
        doctorName: adm.admittedBy?.user?.name || "",
        bedNumber: adm.bed?.bedNumber || "",
        ward: adm.bed?.ward || "",
        bedType: adm.bed?.type || "",
        admissionDate: adm.admissionDate,
        status: adm.status,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new bed
// @route   POST /api/admin/bed-management
// @access  Private (Admin only)
exports.createBed = async (req, res, next) => {
  try {
    const { bedId, roomNumber, bedType, availability, price } = req.body;
    // Map frontend fields to Bed model fields
    const bed = await require("../models/Bed").create({
      bedNumber: bedId,
      type: bedType,
      ward: roomNumber, // If you have a separate ward field, adjust accordingly
      status: availability ? "Available" : "Occupied",
      price: price // use the value from the form
    });
    res.status(201).json({ success: true, data: bed });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a bed
// @route   PUT /api/admin/bed-management/:bedId
// @access  Private (Admin only)
exports.updateBed = async (req, res, next) => {
  try {
    const { bedId } = req.params;
    const { bedId: newBedId, roomNumber, bedType, availability, price } = req.body;
    // Find the bed by bedNumber (unique)
    const bed = await require("../models/Bed").findOne({ bedNumber: bedId });
    if (!bed) {
      return res.status(404).json({ success: false, message: "Bed not found" });
    }
    // Update fields
    bed.bedNumber = newBedId || bed.bedNumber;
    bed.ward = roomNumber || bed.ward;
    bed.type = bedType || bed.type;
    bed.status = availability ? "Available" : "Occupied";
    bed.price = price !== undefined ? price : bed.price;
    await bed.save();
    res.status(200).json({ success: true, data: bed });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a bed
// @route   DELETE /api/admin/bed-management/:bedId
// @access  Private (Admin only)
exports.deleteBed = async (req, res, next) => {
  try {
    const { bedId } = req.params;
    const bed = await require("../models/Bed").findOneAndDelete({ bedNumber: bedId });
    if (!bed) {
      return res.status(404).json({ success: false, message: "Bed not found" });
    }
    res.status(200).json({ success: true, message: "Bed deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Discharge a patient
// @route   PUT /api/admin/admissions/:admissionId/discharge
// @access  Private (Admin only)
exports.dischargeAdmission = async (req, res, next) => {
  try {
    const { admissionId } = req.params;
    const admission = await require("../models/Admission").findById(admissionId).populate('bed');
    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }
    if (admission.dischargeDate) {
      return res.status(400).json({ success: false, message: "Patient already discharged" });
    }
    admission.dischargeDate = new Date();
    admission.status = "Discharged";
    await admission.save();
    // Update bed status
    if (admission.bed) {
      admission.bed.status = "Available";
      await admission.bed.save();
    }
    res.status(200).json({ success: true, message: "Patient discharged successfully" });
  } catch (err) {
    next(err);
  }
}; 