"use client"

import { useState, useEffect } from "react"
import { Table, Input, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const Billing = () => {
  // eslint-disable-next-line no-unused-vars
  const [billingData, setBillingData] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulate fetching billing data from an API
    const fetchData = async () => {
      setLoading(true)
      // Replace this with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const data = [
        {
          key: "1",
          invoiceId: "INV-2023-001",
          customerName: "John Doe",
          amount: 100,
          date: "2023-01-15",
          status: "Paid",
        },
        {
          key: "2",
          invoiceId: "INV-2023-002",
          customerName: "Jane Smith",
          amount: 150,
          date: "2023-02-20",
          status: "Pending",
        },
        {
          key: "3",
          invoiceId: "INV-2023-003",
          customerName: "Peter Jones",
          amount: 200,
          date: "2023-03-10",
          status: "Overdue",
        },
      ]
      setBillingData(data)
      setLoading(false)
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceId",
      key: "invoiceId",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Customer`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => record.customerName.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          // setTimeout(() => this.searchinput.select());
        }
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ]

  return (
    <div>
      <h1>Billing</h1>
      <Table columns={columns} dataSource={billingData} loading={loading} />
    </div>
  )
}

export default Billing
