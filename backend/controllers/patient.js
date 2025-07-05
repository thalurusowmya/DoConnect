const Patient = require("../models/Patient")
const User = require("../models/User")
const Appointment = require("../models/Appointment")
const Prescription = require("../models/Prescription")
const MedicalRecord = require("../models/MedicalRecord")
const Billing = require("../models/Billing")
const Admission = require("../models/Admission")
const Doctor = require("../models/Doctor")
const Bed = require("../models/Bed")

// @desc    Get patient dashboard data
// @route   GET /api/patient/dashboard
// @access  Private (Patient only)
exports.getDashboard = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Appointments
    const now = new Date();
    const appointments = await Appointment.find({ patient: patient._id })
      .populate({ path: "doctor", populate: { path: "user" } })
      .sort({ date: -1 });
    const upcomingAppointmentsCount = appointments.filter(app => app.date > now).length;
    const recentAppointments = appointments.slice(0, 3).map(app => ({
      _id: app._id,
      date: app.date,
      doctorName: app.doctor?.user?.name || "",
      department: app.doctor?.department || "",
      status: app.status,
    }));

    // Prescriptions
    const prescriptionsCount = await Prescription.countDocuments({ patient: patient._id });

    // Pending bills
    const pendingBillsCount = await Billing.countDocuments({ patient: patient._id, paymentStatus: "Pending" });

    // Admissions
    const admissions = await Admission.find({ patient: patient._id })
      .populate({ path: 'admittedBy', populate: { path: 'user' } })
      .populate('bed')
      .sort({ admissionDate: -1 });
    const currentAdmission = admissions.find(adm => !adm.dischargeDate);
    const admissionStatus = currentAdmission ? currentAdmission.status : "None";
    const recentAdmissions = admissions.slice(0, 3).map(adm => ({
      _id: adm._id,
      admissionDate: adm.admissionDate,
      dischargeDate: adm.dischargeDate,
      doctorName: adm.admittedBy && adm.admittedBy.user ? `Dr. ${adm.admittedBy.user.name}` : '',
      diagnosis: adm.diagnosis,
      status: adm.status,
      bed: adm.bed ? `${adm.bed.bedNumber} (${adm.bed.type})` : '',
      ward: adm.bed ? adm.bed.ward : '',
      notes: adm.notes
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          upcomingAppointments: upcomingAppointmentsCount,
          prescriptions: prescriptionsCount,
          pendingBills: pendingBillsCount,
          admissionStatus,
        },
        recentAppointments,
        recentAdmissions,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient only)
exports.getAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    const appointments = await Appointment.find({ patient: patient._id })
      .populate({ path: "doctor", populate: { path: "user" } })
      .sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: appointments.map(app => ({
        _id: app._id,
        date: app.date,
        doctorName: app.doctor?.user?.name || "",
        department: app.doctor?.department || "",
        reason: app.reason,
        status: app.status,
        location: app.location || "",
      })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Book an appointment
// @route   POST /api/patient/appointments
// @access  Private (Patient only)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, reason } = req.body;
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date,
      reason,
      status: "Scheduled",
    });
    // Populate doctor details for the response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
    res.status(201).json({
      success: true,
      data: {
        _id: populatedAppointment._id,
        doctorName: populatedAppointment.doctor?.user?.name || '',
        specialization: populatedAppointment.doctor?.specialization || '',
        department: populatedAppointment.doctor?.department || '',
        date: populatedAppointment.date,
        reason: populatedAppointment.reason,
        status: populatedAppointment.status,
        location: 'Main Hospital'
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Private (Patient only)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id

    // In a real application, you would update the appointment in the database
    // For now, we'll just return a success response

    res.status(200).json({
      success: true,
      data: {
        _id: appointmentId,
        status: "Cancelled",
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get patient medical records
// @route   GET /api/patient/medical-records
// @access  Private (Patient only)
exports.getMedicalRecords = async (req, res, next) => {
  try {
    // In a real application, you would fetch data from the database
    // For now, we'll return mock data

    const medicalRecords = [
      {
        _id: "60d5ec9af682fbd8e84a5230",
        date: new Date("2023-05-10"),
        doctorName: "Dr. Sarah Johnson",
        recordType: "Consultation",
        diagnosis: "Hypertension",
        treatment: "Prescribed Lisinopril 10mg",
        notes: "Blood pressure: 140/90 mmHg. Follow-up in 2 weeks.",
        attachments: [
          {
            name: "Blood Pressure Chart",
            fileUrl: "/files/bp_chart_20230510.pdf",
            fileType: "application/pdf",
            uploadDate: new Date("2023-05-10"),
          },
        ],
      },
      {
        _id: "60d5ec9af682fbd8e84a5231",
        date: new Date("2023-04-25"),
        doctorName: "Dr. Robert Williams",
        recordType: "Lab Test",
        diagnosis: "Migraine",
        treatment: "Prescribed Sumatriptan 50mg and Propranolol 40mg",
        notes: "Patient reports frequent headaches, 2-3 times per week.",
        attachments: [
          {
            name: "MRI Report",
            fileUrl: "/files/mri_report_20230425.pdf",
            fileType: "application/pdf",
            uploadDate: new Date("2023-04-25"),
          },
          {
            name: "MRI Scan",
            fileUrl: "/files/mri_scan_20230425.jpg",
            fileType: "image/jpeg",
            uploadDate: new Date("2023-04-25"),
          },
        ],
      },
      {
        _id: "60d5ec9af682fbd8e84a5232",
        date: new Date("2023-03-15"),
        doctorName: "Dr. Jennifer Lee",
        recordType: "Vaccination",
        diagnosis: "",
        treatment: "Administered influenza vaccine",
        notes: "No adverse reactions observed.",
        attachments: [],
      },
    ]

    res.status(200).json({
      success: true,
      data: medicalRecords,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get patient prescriptions
// @route   GET /api/patient/prescriptions
// @access  Private (Patient only)
exports.getPrescriptions = async (req, res, next) => {
  try {
    // In a real application, you would fetch data from the database
    // For now, we'll return mock data

    const prescriptions = [
      {
        _id: "60d5ec9af682fbd8e84a5220",
        date: new Date("2023-05-10"),
        doctorName: "Dr. Sarah Johnson",
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
      {
        _id: "60d5ec9af682fbd8e84a5221",
        date: new Date("2023-04-25"),
        doctorName: "Dr. Robert Williams",
        diagnosis: "Migraine",
        medications: [
          {
            name: "Sumatriptan",
            dosage: "50mg",
            frequency: "As needed",
            duration: "30 days",
            instructions: "Take at onset of migraine",
          },
          {
            name: "Propranolol",
            dosage: "40mg",
            frequency: "Twice daily",
            duration: "30 days",
            instructions: "Take with food",
          },
        ],
        notes: "Avoid triggers such as caffeine and alcohol",
      },
      {
        _id: "60d5ec9af682fbd8e84a5222",
        date: new Date("2023-03-15"),
        doctorName: "Dr. Michael Chen",
        diagnosis: "Allergic rhinitis",
        medications: [
          {
            name: "Cetirizine",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take as needed for allergy symptoms",
          },
          {
            name: "Fluticasone nasal spray",
            dosage: "50mcg per nostril",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Use in the morning",
          },
        ],
        notes: "Avoid known allergens",
      },
    ]

    res.status(200).json({
      success: true,
      data: prescriptions,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get patient billing
// @route   GET /api/patient/billing
// @access  Private (Patient only)
exports.getBilling = async (req, res, next) => {
  try {
    // In a real application, you would fetch data from the database
    // For now, we'll return mock data

    const bills = [
      {
        _id: "60d5ec9af682fbd8e84a5240",
        invoiceNumber: "INV-2023-001",
        services: [
          {
            name: "Consultation - Cardiology",
            description: "Initial consultation with Dr. Sarah Johnson",
            amount: 150,
          },
          {
            name: "Blood Pressure Test",
            description: "Standard blood pressure measurement",
            amount: 50,
          },
          {
            name: "ECG",
            description: "Electrocardiogram",
            amount: 200,
          },
        ],
        totalAmount: 400,
        paymentStatus: "Paid",
        paymentMethod: "Credit Card",
        paymentDate: new Date("2023-05-10"),
        dueDate: new Date("2023-05-20"),
        notes: "",
        createdAt: new Date("2023-05-10"),
      },
      {
        _id: "60d5ec9af682fbd8e84a5241",
        invoiceNumber: "INV-2023-002",
        services: [
          {
            name: "Consultation - Neurology",
            description: "Consultation with Dr. Robert Williams",
            amount: 200,
          },
          {
            name: "MRI - Brain",
            description: "Magnetic Resonance Imaging of the brain",
            amount: 1200,
          },
        ],
        totalAmount: 1400,
        paymentStatus: "Pending",
        dueDate: new Date("2023-05-30"),
        notes: "",
        createdAt: new Date("2023-04-25"),
      },
      {
        _id: "60d5ec9af682fbd8e84a5242",
        invoiceNumber: "INV-2023-003",
        services: [
          {
            name: "Vaccination - Influenza",
            description: "Annual flu vaccine",
            amount: 75,
          },
        ],
        totalAmount: 75,
        paymentStatus: "Paid",
        paymentMethod: "Insurance",
        paymentDate: new Date("2023-03-15"),
        dueDate: new Date("2023-03-25"),
        notes: "Covered by insurance",
        createdAt: new Date("2023-03-15"),
      },
    ]

    res.status(200).json({
      success: true,
      data: bills,
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get patient admission status
// @route   GET /api/patient/admission
// @access  Private (Patient only)
exports.getAdmission = async (req, res, next) => {
  try {
    // Fetch all admissions for this patient from the database
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    const admissions = await Admission.find({ patient: patient._id })
      .populate({ path: 'bed' })
      .populate({ path: 'admittedBy', populate: { path: 'user' } })
      .sort({ admissionDate: -1 });

    // Find current admission (no dischargeDate)
    const currentAdmission = admissions.find(adm => !adm.dischargeDate);
    // Past admissions (with dischargeDate)
    const admissionHistory = admissions
      .filter(adm => adm.dischargeDate || adm !== currentAdmission)
      .map(adm => ({
        _id: adm._id,
        admissionDate: adm.admissionDate,
        dischargeDate: adm.dischargeDate,
        bedNumber: adm.bed ? `${adm.bed.bedNumber} (${adm.bed.type})` : '',
        ward: adm.bed ? adm.bed.ward : '',
        bedType: adm.bed ? adm.bed.type : '',
        doctorName: adm.admittedBy && adm.admittedBy.user ? `Dr. ${adm.admittedBy.user.name}` : '',
        diagnosis: adm.diagnosis,
        status: adm.status,
        notes: adm.notes
      }));

    res.status(200).json({
      success: true,
      data: {
        currentAdmission: currentAdmission ? {
          _id: currentAdmission._id,
          admissionDate: currentAdmission.admissionDate,
          dischargeDate: currentAdmission.dischargeDate,
          bedNumber: currentAdmission.bed ? `${currentAdmission.bed.bedNumber} (${currentAdmission.bed.type})` : '',
          ward: currentAdmission.bed ? currentAdmission.bed.ward : '',
          bedType: currentAdmission.bed ? currentAdmission.bed.type : '',
          doctorName: currentAdmission.admittedBy && currentAdmission.admittedBy.user ? `Dr. ${currentAdmission.admittedBy.user.name}` : '',
          diagnosis: currentAdmission.diagnosis,
          status: currentAdmission.status,
          notes: currentAdmission.notes
        } : null,
        admissionHistory
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request admission (assign available bed)
// @route   POST /api/patient/admission/request
// @access  Private (Patient only)
exports.requestAdmission = async (req, res, next) => {
  try {
    const { doctorId, diagnosis, roomNumber, bedType, notes } = req.body;
    
    // Find patient
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Find the specific bed
    const bed = await Bed.findOne({ bedNumber: roomNumber, type: bedType });
    if (!bed) {
      return res.status(404).json({ success: false, message: "Selected bed not found" });
    }

    if (bed.status !== "Available") {
      return res.status(400).json({ success: false, message: "Selected bed is not available" });
    }

    // Create admission record
    const admission = await Admission.create({
      patient: patient._id,
      doctor: doctor._id,
      bed: bed._id,
      admittedBy: doctor._id,
      admissionDate: new Date(),
      diagnosis,
      notes,
      status: "Admitted",
      bedType,
      ward: bed.ward,
      bedNumber: bed.bedNumber
    });

    // Update bed status
    bed.status = "Reserved";
    await bed.save();

    // Populate the admission data for response
    const populatedAdmission = await Admission.findById(admission._id)
      .populate('admittedBy', 'user specialization department')
      .populate('patient', 'user');

    res.status(201).json({
      success: true,
      message: "Admission request submitted successfully",
      data: {
        _id: populatedAdmission._id,
        admissionDate: populatedAdmission.admissionDate,
        doctorName: populatedAdmission.admittedBy.user.name,
        diagnosis: populatedAdmission.diagnosis,
        status: populatedAdmission.status,
        bedType: populatedAdmission.bedType,
        ward: populatedAdmission.ward,
        bedNumber: populatedAdmission.bedNumber,
        notes: populatedAdmission.notes
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patient/profile
// @access  Private (Patient only)
exports.updateProfile = async (req, res, next) => {
  try {
    const { bloodGroup, allergies, medicalHistory, emergencyContact, insurance } = req.body

    // In a real application, you would update the patient profile in the database
    // For now, we'll just return a success response

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        bloodGroup,
        allergies,
        medicalHistory,
        emergencyContact,
        insurance,
      },
    })
  } catch (err) {
    next(err)
  }
}

// @desc    Get available beds for patients (optionally filtered by type)
// @route   GET /api/patient/available-beds
// @access  Private (Patient only)
exports.getAvailableBeds = async (req, res, next) => {
  try {
    const filter = { status: "Available" };
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const beds = await require("../models/Bed").find(filter);
    res.status(200).json({ success: true, data: beds });
  } catch (err) {
    next(err);
  }
};
