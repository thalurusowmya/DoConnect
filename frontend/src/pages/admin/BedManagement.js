"use client"

import { useState, useEffect } from "react"
import { Table, Button, Modal, Form, Input, Select, message } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"

const { Option } = Select

const BedManagement = () => {
  const [beds, setBeds] = useState([])
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const [editingBed, setEditingBed] = useState(null)

  const columns = [
    {
      title: "Bed ID",
      dataIndex: "bedId",
      key: "bedId",
    },
    {
      title: "Room Number",
      dataIndex: "roomNumber",
      key: "roomNumber",
    },
    {
      title: "Bed Type",
      dataIndex: "bedType",
      key: "bedType",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (status) => status,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => value !== undefined ? `₹${value}` : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            style={{ marginLeft: 8 }}
            onClick={() => handleDelete(record.bedId)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ]

  useEffect(() => {
    fetchBeds()
  }, [])

  // Add this comment before the line with fetchBeds
  // eslint-disable-next-line no-unused-vars
  const fetchBeds = async () => {
    try {
      const response = await fetch("/api/admin/bed-management", { credentials: "include" })
      const result = await response.json()
      if (result.success) {
        const mappedBeds = result.data.map(bed => ({
          bedId: bed.bedNumber,
          roomNumber: bed.ward,
          bedType: bed.type,
          availability: bed.status,
          price: bed.price,
          _id: bed._id,
        }))
        setBeds(mappedBeds)
      } else {
        setBeds([])
        message.error("Failed to fetch beds")
      }
    } catch (error) {
      console.error("Error fetching beds:", error)
      message.error("Failed to fetch beds")
    }
  }

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setConfirmLoading(true)
        if (editingBed) {
          updateBed(editingBed.bedId, values)
        } else {
          createBed(values)
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
        setConfirmLoading(false)
      })
  }

  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
    setEditingBed(null)
  }

  const createBed = async (values) => {
    const payload = {
      bedId: values.bedId,
      roomNumber: values.roomNumber,
      bedType: values.bedType,
      availability: values.availability ? true : false,
      price: values.price,
    }
    try {
      const response = await fetch("/api/admin/bed-management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        message.success("Bed created successfully")
        fetchBeds()
      } else {
        message.error("Failed to create bed")
      }
    } catch (error) {
      console.error("Error creating bed:", error)
      message.error("Failed to create bed")
    } finally {
      setConfirmLoading(false)
      setVisible(false)
      form.resetFields()
    }
  }

  const updateBed = async (bedId, values) => {
    const payload = {
      bedId: values.bedId,
      roomNumber: values.roomNumber,
      bedType: values.bedType,
      availability: values.availability ? true : false,
      price: values.price,
    }
    try {
      const response = await fetch(`/api/admin/bed-management/${bedId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        message.success("Bed updated successfully")
        fetchBeds()
      } else {
        message.error("Failed to update bed")
      }
    } catch (error) {
      console.error("Error updating bed:", error)
      message.error("Failed to update bed")
    } finally {
      setConfirmLoading(false)
      setVisible(false)
      form.resetFields()
      setEditingBed(null)
    }
  }

  const handleDelete = async (bedId) => {
    try {
      const response = await fetch(`/api/admin/bed-management/${bedId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        message.success("Bed deleted successfully")
        fetchBeds()
      } else {
        message.error("Failed to delete bed")
      }
    } catch (error) {
      console.error("Error deleting bed:", error)
      message.error("Failed to delete bed")
    }
  }

  const handleEdit = (record) => {
    setEditingBed(record)
    form.setFieldsValue(record)
    setVisible(true)
  }

  return (
    <div>
      <h1>Bed Management</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Bed
      </Button>
      <Table columns={columns} dataSource={beds} rowKey="bedId" />
      <Modal
        title={editingBed ? "Edit Bed" : "Add Bed"}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="bedId" label="Bed ID" rules={[{ required: true, message: "Please input the bed ID!" }]}>
            <Input disabled={editingBed} />
          </Form.Item>
          <Form.Item
            name="roomNumber"
            label="Room Number"
            rules={[{ required: true, message: "Please input the room number!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bedType"
            label="Bed Type"
            rules={[{ required: true, message: "Please select the bed type!" }]}
          >
            <Select>
              <Option value="General">General</Option>
              <Option value="Semi-Private">Semi-Private</Option>
              <Option value="Private">Private</Option>
              <Option value="ICU">ICU</Option>
              <Option value="Emergency">Emergency</Option>
            </Select>
          </Form.Item>
          <Form.Item name="availability" label="Availability" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the bed price!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BedManagement
