"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { FiPrinter } from "react-icons/fi"
import "./PatientStyles.css"

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/patient/prescriptions`, {
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

    // For development, use mock data
    setPrescriptions([
      {
        _id: "1",
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
        _id: "2",
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
    ])
    setLoading(false)

    // Uncomment this when backend is ready
    fetchPrescriptions()
  }, [])

  const printPrescription = (id) => {
    const prescriptionToPrint = prescriptions.find((p) => p._id === id)
    if (!prescriptionToPrint) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${prescriptionToPrint.doctorName}</title>
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
            <p><strong>Doctor:</strong> ${prescriptionToPrint.doctorName}</p>
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
              ${prescriptionToPrint.doctorName}
            </div>
            <p>Doctor's Signature</p>
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
    <div className="patient-prescriptions">
      <div className="page-header">
        <h2>My Prescriptions</h2>
      </div>

      {prescriptions.length > 0 ? (
        <div className="prescriptions-list">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="prescription-card detailed">
              <div className="prescription-header">
                <div>
                  <h3>{prescription.doctorName}</h3>
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
        </div>
      )}
    </div>
  )
}

export default PatientPrescriptions
