import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { toast, Toaster } from "react-hot-toast";
import { FiUser, FiCalendar, FiHome, FiFileText } from "react-icons/fi";
import "./DoctorStyles.css";

const DoctorAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/doctor/admissions`, {
          withCredentials: true,
        });
        
        if (response.data.success) {
          setAdmissions(response.data.data);
        } else {
          setError("Failed to fetch admissions data");
          toast.error("Failed to fetch admissions data");
        }
      } catch (err) {
        console.error("Error fetching admissions:", err);
        setError(err.response?.data?.message || "Failed to fetch admissions");
        toast.error(err.response?.data?.message || "Failed to fetch admissions");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-admissions">
      <Toaster position="top-right" />
      <div className="page-header">
        <h2>Patient Admissions</h2>
      </div>

      {admissions.length > 0 ? (
        <div className="portal-grid">
          {admissions.map((adm) => (
            <div key={adm._id} className="portal-card">
              <div className="card-header">
                <div className="card-icon">
                  <FiUser />
                </div>
                <div className="card-title">
                  <h3>{adm.patientName}</h3>
                  <p>Admitted on {new Date(adm.admissionDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="card-content">
                <div className="card-stats">
                  <div className="stat-item">
                    <h4>Bed</h4>
                    <p>{adm.bedNumber} ({adm.bedType})</p>
                  </div>
                  <div className="stat-item">
                    <h4>Ward</h4>
                    <p>{adm.ward}</p>
                  </div>
                </div>
                <div className="card-list">
                  <div className="list-item">
                    <div className="list-item-info">
                      <h4>Diagnosis</h4>
                      <p>{adm.diagnosis}</p>
                    </div>
                  </div>
                  {adm.notes && (
                    <div className="list-item">
                      <div className="list-item-info">
                        <h4>Notes</h4>
                        <p>{adm.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <span className={`status-badge ${adm.status.toLowerCase()}`}>
                  {adm.status}
                </span>
                {adm.dischargeDate && (
                  <span className="discharge-date">
                    Discharged: {new Date(adm.dischargeDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No admissions found</p>
          <p className="sub-text">You haven't admitted any patients yet.</p>
        </div>
      )}
    </div>
  );
};

export default DoctorAdmissions;
