"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../config"
import { FiDollarSign, FiDownload, FiEye } from "react-icons/fi"
import "./PatientStyles.css"

const PatientBilling = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBill, setSelectedBill] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`${API_URL}/patient/billing`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setBills(response.data.data)
        }
      } catch (err) {
        console.error("Error fetching bills:", err)
      } finally {
        setLoading(false)
      }
    }

    // For development, use mock data
    setBills([
      {
        _id: "1",
        invoiceNumber: "INV-2023-001",
        date: new Date("2023-05-15"),
        services: [
          {
            name: "Consultation",
            description: "Regular check-up",
            amount: 100,
          },
          {
            name: "Blood Test",
            description: "Complete blood count",
            amount: 75,
          },
        ],
        totalAmount: 175,
        paymentStatus: "Pending",
        dueDate: new Date("2023-06-15"),
      },
      {
        _id: "2",
        invoiceNumber: "INV-2023-002",
        date: new Date("2023-04-20"),
        services: [
          {
            name: "X-Ray",
            description: "Chest X-Ray",
            amount: 150,
          },
        ],
        totalAmount: 150,
        paymentStatus: "Paid",
        paymentDate: new Date("2023-04-25"),
        paymentMethod: "Credit Card",
      },
    ])
    setLoading(false)

    // Uncomment this when backend is ready
    fetchBills()
  }, [])

  const viewBill = (bill) => {
    setSelectedBill(bill)
    setShowModal(true)
  }

  const downloadBill = (bill) => {
    // Implement bill download functionality
    console.log("Downloading bill:", bill.invoiceNumber)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="patient-billing">
      <div className="page-header">
        <h2>Billing & Payments</h2>
      </div>

      {bills.length > 0 ? (
        <div className="portal-grid">
          {bills.map((bill) => (
            <div key={bill._id} className="portal-card">
              <div className="card-header">
                <div className="card-icon">
                  <FiDollarSign />
                </div>
                <div className="card-title">
                  <h3>Invoice #{bill.invoiceNumber}</h3>
                  <p>{new Date(bill.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="card-content">
                <div className="card-stats">
                  <div className="stat-item">
                    <h4>Total Amount</h4>
                    <p>${bill.totalAmount}</p>
                  </div>
                  <div className="stat-item">
                    <h4>Status</h4>
                    <p>
                      <span className={`status-badge ${bill.paymentStatus.toLowerCase()}`}>
                        {bill.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="card-list">
                  <div className="list-item">
                    <div className="list-item-info">
                      <h4>Services</h4>
                      <p>{bill.services.length} item(s)</p>
                    </div>
                  </div>
                  {bill.paymentStatus === "Pending" && (
                    <div className="list-item">
                      <div className="list-item-info">
                        <h4>Due Date</h4>
                        <p>{new Date(bill.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {bill.paymentStatus === "Paid" && (
                    <div className="list-item">
                      <div className="list-item-info">
                        <h4>Paid On</h4>
                        <p>{new Date(bill.paymentDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <div className="action-buttons">
                  <button className="btn btn-outline" onClick={() => viewBill(bill)}>
                    <FiEye />
                    <span>View Details</span>
                  </button>
                  <button className="btn btn-outline" onClick={() => downloadBill(bill)}>
                    <FiDownload />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-container">
          <div className="no-data-icon">
            <FiDollarSign />
          </div>
          <p className="no-data-text">No bills found</p>
        </div>
      )}

      {/* Bill Details Modal */}
      {showModal && selectedBill && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>Bill Details</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-content">
              <div className="record-detail-section">
                <h3>Invoice Information</h3>
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Invoice Number:</span>
                    <span className="detail-value">{selectedBill.invoiceNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(selectedBill.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      <span className={`status-badge ${selectedBill.paymentStatus.toLowerCase()}`}>
                        {selectedBill.paymentStatus}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="record-detail-section">
                <h3>Services</h3>
                <div className="services-list">
                  {selectedBill.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <div className="service-info">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                      </div>
                      <div className="service-amount">${service.amount}</div>
                    </div>
                  ))}
                  <div className="service-total">
                    <h4>Total Amount</h4>
                    <div className="total-amount">${selectedBill.totalAmount}</div>
                  </div>
                </div>
              </div>

              {selectedBill.paymentStatus === "Paid" && (
                <div className="record-detail-section">
                  <h3>Payment Information</h3>
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Payment Date:</span>
                      <span className="detail-value">{new Date(selectedBill.paymentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Method:</span>
                      <span className="detail-value">{selectedBill.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedBill.paymentStatus === "Pending" && (
                <div className="record-detail-section">
                  <h3>Payment Due</h3>
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Due Date:</span>
                      <span className="detail-value">{new Date(selectedBill.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => downloadBill(selectedBill)}>
                <FiDownload />
                <span>Download Invoice</span>
              </button>
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

export default PatientBilling
