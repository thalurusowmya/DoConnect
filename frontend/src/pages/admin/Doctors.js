"use client"

import { useState, useEffect } from "react"
import { Table } from "antd"
// import { FiClipboard } from "react-icons/fi"

const Doctors = () => {
  const [doctors, setDoctors] = useState([])

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/admin/doctors", { credentials: "include" })
      const result = await response.json()
      if (result.success) {
        setDoctors(result.data)
      } else {
        setDoctors([])
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      setDoctors([])
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const columns = [
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      render: (text, record) => record.user?.name || record.name || "-"
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (text, record) => record.user?.email || "-"
    },
  ]

  return (
    <div>
      <h1>Doctors</h1>
      <Table columns={columns} dataSource={doctors} rowKey={record => record._id} />
    </div>
  )
}

export default Doctors
