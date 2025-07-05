"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { FiDownload, FiEye, FiFileText } from "react-icons/fi"
import "./PatientStyles.css"

const PatientMedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get(`${API_URL}/patient/medical-records`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setMedicalRecords(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching medical records:", err)
      } finally {
        setLoading(false)
      }
    }

    // For development, use mock data
    setMedicalRecords([
      {
        _id: "1",
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
        _id: "2",
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
    ])
    setLoading(false)

    // Uncomment this when backend is ready
    fetchMedicalRecords()
  }, [])

  const viewRecord = (record) => {
    setSelectedRecord(record)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="patient-medical-records">
      <div className="page-header">
        <h2>Medical Records</h2>
      </div>

      {medicalRecords.length > 0 ? (
        <div className="portal-grid">
          {medicalRecords.map((record) => (
            <div key={record._id} className="portal-card">
              <div className="card-header">
                <div className="card-icon">
                  <FiFileText />
                </div>
                <div className="card-title">
                  <h3>{record.recordType}</h3>
                  <p>{new Date(record.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="card-content">
                <div className="card-stats">
                  <div className="stat-item">
                    <h4>Doctor</h4>
                    <p>{record.doctorName}</p>
                  </div>
                  <div className="stat-item">
                    <h4>Diagnosis</h4>
                    <p>{record.diagnosis}</p>
                  </div>
                </div>
                <div className="card-list">
                  <div className="list-item">
                    <div className="list-item-info">
                      <h4>Treatment</h4>
                      <p>{record.treatment}</p>
                    </div>
                  </div>
                  {record.attachments && record.attachments.length > 0 && (
                    <div className="list-item">
                      <div className="list-item-info">
                        <h4>Attachments</h4>
                        <p>{record.attachments.length} file(s)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-outline" onClick={() => viewRecord(record)}>
                  <FiEye />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-container">
          <div className="no-data-icon">
            <FiFileText />
          </div>
          <p className="no-data-text">No medical records found</p>
        </div>
      )}

      {/* Record Details Modal */}
      {showModal && selectedRecord && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>Medical Record Details</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <div className="record-detail-section">
                <h3>General Information</h3>
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(selectedRecord.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Doctor:</span>
                    <span className="detail-value">{selectedRecord.doctorName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Record Type:</span>
                    <span className="detail-value">{selectedRecord.recordType}</span>
                  </div>
                </div>
              </div>

              <div className="record-detail-section">
                <h3>Medical Details</h3>
                <div className="detail-row">
                  <div className="detail-item full-width">
                    <span className="detail-label">Diagnosis:</span>
                    <span className="detail-value">{selectedRecord.diagnosis}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item full-width">
                    <span className="detail-label">Treatment:</span>
                    <span className="detail-value">{selectedRecord.treatment}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-item full-width">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{selectedRecord.notes}</span>
                  </div>
                </div>
              </div>

              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div className="record-detail-section">
                  <h3>Attachments</h3>
                  <div className="attachments-grid">
                    {selectedRecord.attachments.map((attachment, index) => (
                      <div key={index} className="attachment-item">
                        <div className="attachment-icon">
                          {attachment.fileType.includes("image") ? (
                            <img
                              src={attachment.fileUrl || "/placeholder.svg"}
                              alt={attachment.name}
                              className="attachment-thumbnail"
                            />
                          ) : (
                            <FiDownload size={24} />
                          )}
                        </div>
                        <div className="attachment-info">
                          <p className="attachment-name">{attachment.name}</p>
                          <p className="attachment-date">{new Date(attachment.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <a
                          href={attachment.fileUrl}
                          download={attachment.name}
                          className="btn btn-outline download-btn"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientMedicalRecords
