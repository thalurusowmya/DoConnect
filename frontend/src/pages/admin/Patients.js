"use client"

import { useState, useEffect } from "react"
import { Table } from "antd"

const Patients = () => {
  const [patients, setPatients] = useState([])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/admin/patients", { credentials: "include" })
      const result = await response.json()
      if (result.success) {
        setPatients(result.data)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      setPatients([])
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      render: (text, record) => record.user?.name || "-"
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (text, record) => record.user?.email || "-"
    },
    {
      title: "Date of Birth",
      key: "dob",
      render: (value, record) => {
        const dob = record.user?.dateOfBirth;
        if (!dob) return "-";
        // Format as YYYY-MM-DD
        const date = new Date(dob);
        return !isNaN(date) ? date.toISOString().split('T')[0] : "-";
      }
    },
    {
      title: "Address",
      key: "address",
      render: (value, record) => record.user?.address || "-"
    },
  ]

  return (
    <div>
      <h1>Patients</h1>
      <Table dataSource={patients} columns={columns} rowKey={record => record._id} />
    </div>
  )
}

export default Patients
