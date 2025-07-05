"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { FiPlus, FiPrinter } from "react-icons/fi"
import "./DoctorStyles.css"

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    notes: "",
  })

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctor/prescriptions`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setPrescriptions(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctor/patients`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setPatients(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching patients:", err)
      }
    }

    // For development, use mock data
    setPrescriptions([
      {
        _id: "1",
        patientName: "John Smith",
        patientId: "1",
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
        _id: "2",
        patientName: "John Smith",
        patientId: "1",
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
      {
        _id: "3",
        patientName: "Emily Johnson",
        patientId: "2",
        date: new Date("2023-05-12"),
        diagnosis: "Acute bronchitis",
        medications: [
          {
            name: "Azithromycin",
            dosage: "500mg",
            frequency: "Once daily",
            duration: "5 days",
            instructions: "Take with or without food",
          },
          {
            name: "Benzonatate",
            dosage: "200mg",
            frequency: "3 times daily",
            duration: "7 days",
            instructions: "Take for cough",
          },
        ],
        notes: "Rest and increase fluid intake",
      },
    ])

    setPatients([
      {
        _id: "1",
        name: "John Smith",
      },
      {
        _id: "2",
        name: "Emily Johnson",
      },
      {
        _id: "3",
        name: "Michael Brown",
      },
      {
        _id: "4",
        name: "Sarah Wilson",
      },
    ])

    setLoading(false)

    // Uncomment these when backend is ready
    fetchPrescriptions()
    fetchPatients()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target
    const updatedMedications = [...formData.medications]
    updatedMedications[index] = {
      ...updatedMedications[index],
      [name]: value,
    }
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }))
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    }))
  }

  const removeMedication = (index) => {
    if (formData.medications.length === 1) return
    const updatedMedications = [...formData.medications]
    updatedMedications.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${API_URL}/doctor/prescriptions`, formData, {
        withCredentials: true,
      })

      if (response.data.success) {
        // Add the new prescription to the list
        const patient = patients.find((p) => p._id === formData.patientId)
        const newPrescription = {
          ...response.data.data,
          patientName: patient.name,
        }

        setPrescriptions([newPrescription, ...prescriptions])
        setShowModal(false)
        setFormData({
          patientId: "",
          diagnosis: "",
          medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
          notes: "",
        })
        alert("Prescription created successfully!")
      }
    } catch (err) {
      console.error("Error creating prescription:", err)
      alert("Failed to create prescription. Please try again.")
    }
  }

  const printPrescription = (id) => {
    const prescriptionToPrint = prescriptions.find((p) => p._id === id)
    if (!prescriptionToPrint) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${prescriptionToPrint.patientName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .prescription-info { margin-bottom: 20px; }
            .prescription-info p { margin: 5px 0; }
            .medications { margin-bottom: 20px; }
            .medication { margin-bottom: 10px; padding-left: 20px; }
            .footer { margin-top: 40px; }
            .signature { margin-top: 60px; border-top: 1px solid #000; width: 200px; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Hospital Management System</h1>
            <h2>Prescription</h2>
          </div>
          
          <div class="prescription-info">
            <p><strong>Date:</strong> ${new Date(prescriptionToPrint.date).toLocaleDateString()}</p>
            <p><strong>Patient:</strong> ${prescriptionToPrint.patientName}</p>
            <p><strong>Diagnosis:</strong> ${prescriptionToPrint.diagnosis}</p>
          </div>
          
          <div class="medications">
            <h3>Medications:</h3>
            ${prescriptionToPrint.medications
              .map(
                (med) => `
              <div class="medication">
                <p><strong>${med.name}</strong> - ${med.dosage}</p>
                <p>Take ${med.frequency} for ${med.duration}</p>
                <p>Instructions: ${med.instructions}</p>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="notes">
            <h3>Notes:</h3>
            <p>${prescriptionToPrint.notes}</p>
          </div>
          
          <div class="footer">
            <div class="signature">
              Doctor's Signature
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return <div className="loading">Loading prescriptions...</div>
  }

  return (
    <div className="doctor-prescriptions">
      <div className="page-header">
        <h2>Prescriptions</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus />
          <span>New Prescription</span>
        </button>
      </div>

      {prescriptions.length > 0 ? (
        <div className="prescriptions-list">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="prescription-card detailed">
              <div className="prescription-header">
                <div>
                  <h3>{prescription.patientName}</h3>
                  <p className="prescription-date">{new Date(prescription.date).toLocaleDateString()}</p>
                </div>
                <button className="btn btn-outline print-btn" onClick={() => printPrescription(prescription._id)}>
                  <FiPrinter />
                  <span>Print</span>
                </button>
              </div>
              <div className="prescription-details">
                <p>
                  <strong>Diagnosis:</strong> {prescription.diagnosis}
                </p>
                <div className="medications-section">
                  <p>
                    <strong>Medications:</strong>
                  </p>
                  <ul className="medication-list">
                    {prescription.medications.map((med, index) => (
                      <li key={index} className="medication-item">
                        <div className="medication-name">{med.name}</div>
                        <div className="medication-info">
                          <span>{med.dosage}</span>
                          <span>{med.frequency}</span>
                          <span>{med.duration}</span>
                        </div>
                        <div className="medication-instructions">{med.instructions}</div>
                      </li>
                    ))}
                  </ul>
                </div>
                {prescription.notes && (
                  <div className="prescription-notes">
                    <p>
                      <strong>Notes:</strong> {prescription.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-container">
          <p className="no-data">No prescriptions found</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create Your First Prescription
          </button>
        </div>
      )}

      {/* New Prescription Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>New Prescription</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="prescription-form">
              <div className="form-group">
                <label htmlFor="patientId" className="form-label">
                  Patient
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  className="form-input"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis" className="form-label">
                  Diagnosis
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  className="form-input"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="medications-form">
                <h3>Medications</h3>
                {formData.medications.map((medication, index) => (
                  <div key={index} className="medication-form">
                    <div className="medication-header">
                      <h4>Medication {index + 1}</h4>
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline remove-btn"
                          onClick={() => removeMedication(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`medication-name-${index}`} className="form-label">
                          Name
                        </label>
                        <input
                          type="text"
                          id={`medication-name-${index}`}
                          name="name"
                          className="form-input"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, e)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`medication-dosage-${index}`} className="form-label">
                          Dosage
                        </label>
                        <input
                          type="text"
                          id={`medication-dosage-${index}`}
                          name="dosage"
                          className="form-input"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor={`medication-frequency-${index}`} className="form-label">
                          Frequency
                        </label>
                        <input
                          type="text"
                          id={`medication-frequency-${index}`}
                          name="frequency"
                          className="form-input"
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, e)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`medication-duration-${index}`} className="form-label">
                          Duration
                        </label>
                        <input
                          type="text"
                          id={`medication-duration-${index}`}
                          name="duration"
                          className="form-input"
                          value={medication.duration}
                          onChange={(e) => handleMedicationChange(index, e)}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`medication-instructions-${index}`} className="form-label">
                        Instructions
                      </label>
                      <input
                        type="text"
                        id={`medication-instructions-${index}`}
                        name="instructions"
                        className="form-input"
                        value={medication.instructions}
                        onChange={(e) => handleMedicationChange(index, e)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline add-btn" onClick={addMedication}>
                  Add Medication
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-input"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorPrescriptions
