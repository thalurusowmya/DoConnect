"use client"

import { useState, useEffect } from "react"
import { Table } from "antd"
import { Link } from "react-router-dom"
import { FiUser, FiCalendar, FiPhone, FiMapPin } from "react-icons/fi"
import "./DoctorStyles.css"

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
        const response = await fetch(`${apiUrl}/doctor/patients`, {
          credentials: "include"
        })
        const data = await response.json()
        if (data.success) {
          setPatients(data.data || [])
        } else {
          console.error("Failed to fetch patients:", data.message)
        }
      } catch (error) {
        console.error("Error fetching patients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/doctor/patient/${record._id}`} className="patient-name-link">
          <FiUser className="icon" />
          {text}
        </Link>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age) => `${age} years`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => (
        <span className="contact-info">
          <FiPhone className="icon" />
          {contact}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <span className="address-info">
          <FiMapPin className="icon" />
          {address}
        </span>
      ),
    },
    {
      title: "Last Visit",
      dataIndex: "lastVisit",
      key: "lastVisit",
      render: (date) => (
        <span className="last-visit">
          <FiCalendar className="icon" />
          {date ? new Date(date).toLocaleDateString() : "No visits yet"}
        </span>
      ),
    },
  ]

  return (
    <div className="doctor-patients">
      <div className="page-header">
        <h2>My Patients</h2>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading patients...</p>
        </div>
      ) : (
        <div className="table-container">
          <Table 
            columns={columns} 
            dataSource={patients} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            className="patients-table"
          />
        </div>
      )}
    </div>
  )
}

export default Patients
