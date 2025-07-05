"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { FiMonitor, FiCalendar, FiHome } from "react-icons/fi"
import "./PatientStyles.css"
import { toast, Toaster } from "react-hot-toast"

const PatientAdmission = () => {
  const [admissionData, setAdmissionData] = useState({
    currentAdmission: null,
    admissionHistory: [],
  })
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestForm, setRequestForm] = useState({
    doctorId: "",
    diagnosis: "",
    bedType: "",
    roomNumber: "",
  })
  const [availableBeds, setAvailableBeds] = useState([])
  const [filteredBeds, setFilteredBeds] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch admission data
        const admissionResponse = await axios.get(`${API_URL}/patient/admission`, {
          withCredentials: true,
        })
        if (admissionResponse.data.success) {
          setAdmissionData({
            currentAdmission: admissionResponse.data.data.currentAdmission || null,
            admissionHistory: admissionResponse.data.data.admissionHistory || [],
          });
        }

        // Fetch doctors
        const doctorsResponse = await axios.get(`${API_URL}/doctor/list`, {
          withCredentials: true,
        })
        if (doctorsResponse.data.success) {
          setDoctors(doctorsResponse.data.data)
        }

        // Fetch all available beds
        const bedsResponse = await axios.get(`${API_URL}/patient/available-beds`, {
          withCredentials: true,
        })
        if (bedsResponse.data.success) {
          setAvailableBeds(bedsResponse.data.data)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        toast.error("Failed to load data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter beds by selected type
  useEffect(() => {
    if (requestForm.bedType) {
      setFilteredBeds(availableBeds.filter(bed => bed.type === requestForm.bedType))
    } else {
      setFilteredBeds([])
    }
  }, [requestForm.bedType, availableBeds])

  const handleRequestChange = (e) => {
    const { name, value } = e.target
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/patient/admission/request`,
        requestForm,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Admission request submitted successfully!");
        
        // Add the new admission to the history
        setAdmissionData(prev => ({
          ...prev,
          admissionHistory: [
            {
              _id: response.data.data._id,
              admissionDate: response.data.data.admissionDate,
              doctorName: response.data.data.doctorName,
              diagnosis: response.data.data.diagnosis,
              status: response.data.data.status,
              bedType: response.data.data.bedType,
              ward: response.data.data.ward,
              bedNumber: response.data.data.bedNumber,
              notes: response.data.data.notes
            },
            ...prev.admissionHistory
          ]
        }));

        // Reset form and close modal
        setRequestForm({
          doctorId: "",
          diagnosis: "",
          bedType: "",
          roomNumber: "",
        });
        setShowRequestModal(false);
      }
    } catch (err) {
      console.error("Error submitting admission request:", err);
      toast.error(err.response?.data?.message || "Failed to submit admission request");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="patient-admission">
      <Toaster position="top-right" />
      <div className="page-header">
        <h2>Hospital Admission</h2>
        {!admissionData.currentAdmission && (
          <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}>
            Request Admission
          </button>
        )}
      </div>

      {admissionData.currentAdmission ? (
        <div className="portal-grid">
          <div className="portal-card">
            <div className="card-header">
              <div className="card-icon">
                <FiMonitor />
              </div>
              <div className="card-title">
                <h3>Current Admission</h3>
                <p>Since {new Date(admissionData.currentAdmission.admissionDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="card-content">
              <div className="card-stats">
                <div className="stat-item">
                  <h4>Bed Number</h4>
                  <p>{admissionData.currentAdmission.bedNumber}</p>
                </div>
                <div className="stat-item">
                  <h4>Ward</h4>
                  <p>{admissionData.currentAdmission.ward}</p>
                </div>
              </div>
              <div className="card-list">
                <div className="list-item">
                  <div className="list-item-info">
                    <h4>Bed Type</h4>
                    <p>{admissionData.currentAdmission.bedType}</p>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-item-info">
                    <h4>Doctor</h4>
                    <p>{admissionData.currentAdmission.doctorName}</p>
                  </div>
                </div>
                <div className="list-item">
                  <div className="list-item-info">
                    <h4>Diagnosis</h4>
                    <p>{admissionData.currentAdmission.diagnosis}</p>
                  </div>
                </div>
              {admissionData.currentAdmission.notes && (
                  <div className="list-item">
                    <div className="list-item-info">
                      <h4>Notes</h4>
                      <p>{admissionData.currentAdmission.notes}</p>
                  </div>
                </div>
              )}
              </div>
            </div>
            <div className="card-footer">
              <span className="status-badge active">Currently Admitted</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="portal-grid">
          <div className="portal-card">
            <div className="card-header">
              <div className="card-icon">
                <FiHome />
              </div>
              <div className="card-title">
                <h3>No Current Admission</h3>
                <p>You are not currently admitted to the hospital</p>
              </div>
            </div>
            <div className="card-content">
              <p>If you need to be admitted to the hospital, please click the button below to request admission.</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}>
                Request Admission
              </button>
            </div>
          </div>
        </div>
      )}

      {admissionData.admissionHistory.length > 0 && (
        <div className="admission-history">
          <h3>Admission History</h3>
          <div className="portal-grid">
            {admissionData.admissionHistory.map((admission) => (
              <div key={admission._id} className="portal-card">
                <div className="card-header">
                  <div className="card-icon">
                    <FiCalendar />
                  </div>
                  <div className="card-title">
                    <h3>Past Admission</h3>
                    <p>
                      {new Date(admission.admissionDate).toLocaleDateString()} to{" "}
                      {admission.dischargeDate ? new Date(admission.dischargeDate).toLocaleDateString() : "Present"}
                    </p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-stats">
                    <div className="stat-item">
                      <h4>Bed</h4>
                      <p>
                        {admission.bedNumber} ({admission.bedType})
                      </p>
                    </div>
                    <div className="stat-item">
                      <h4>Ward</h4>
                      <p>{admission.ward}</p>
                    </div>
                  </div>
                  <div className="card-list">
                    <div className="list-item">
                      <div className="list-item-info">
                        <h4>Doctor</h4>
                        <p>{admission.doctorName}</p>
                    </div>
                    </div>
                    <div className="list-item">
                      <div className="list-item-info">
                        <h4>Diagnosis</h4>
                        <p>{admission.diagnosis}</p>
                      </div>
                  </div>
                  {admission.notes && (
                      <div className="list-item">
                        <div className="list-item-info">
                          <h4>Notes</h4>
                          <p>{admission.notes}</p>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
                <div className="card-footer">
                  <span className={`status-badge ${admission.status.toLowerCase()}`}>{admission.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Admission Modal */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Request Hospital Admission</h2>
              <button className="close-modal" onClick={() => setShowRequestModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleRequestSubmit} className="admission-form">
              <div className="form-group">
                <label htmlFor="doctorId" className="form-label">
                  Select Doctor
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  className="form-input"
                  value={requestForm.doctorId}
                  onChange={handleRequestChange}
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.user?.name || doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bedType" className="form-label">
                  Preferred Bed Type
                </label>
                <select
                  id="bedType"
                  name="bedType"
                  className="form-input"
                  value={requestForm.bedType}
                  onChange={handleRequestChange}
                  required
                >
                  <option value="">Select bed type</option>
                  <option value="General">General</option>
                  <option value="Semi-Private">Semi-Private</option>
                  <option value="Private">Private</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {requestForm.bedType && (
                <div className="form-group">
                  <label htmlFor="roomNumber" className="form-label">
                    Room Number
                  </label>
                  <select
                    id="roomNumber"
                    name="roomNumber"
                    className="form-input"
                    value={requestForm.roomNumber || ""}
                    onChange={handleRequestChange}
                    required
                  >
                    <option value="">Select room number</option>
                    {filteredBeds.map(bed => (
                      <option key={bed._id} value={bed.bedNumber}>
                        {bed.ward} (Bed #{bed.bedNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="diagnosis" className="form-label">
                  Diagnosis
                </label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  className="form-input"
                  value={requestForm.diagnosis}
                  onChange={handleRequestChange}
                  rows="3"
                  required
                  placeholder="Enter your diagnosis or reason for admission"
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientAdmission

