"use client"

import { useState, useEffect } from "react"
import { Table, Button, Input, Space, Modal, Form } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [searchText, setSearchText] = useState("")
  const [searchedColumn, setSearchedColumn] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // const fetchInventory = async () => {
  //   setLoading(true)
  //   try {
  //     // eslint-disable-next-line no-unused-vars
  //     const response = await fetch("/api/inventory") // Replace with your API endpoint
  //     const data = await response.json()
  //     setInventory(data)
  //   } catch (error) {
  //     console.error("Error fetching inventory:", error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  useEffect(() => {
    // Mock inventory/medicines data
    setInventory([
      { id: 1, name: "Paracetamol", description: "Pain reliever and fever reducer", quantity: 200, price: 0.5 },
      { id: 2, name: "Amoxicillin", description: "Antibiotic for bacterial infections", quantity: 120, price: 1.2 },
      { id: 3, name: "Ibuprofen", description: "Nonsteroidal anti-inflammatory drug (NSAID)", quantity: 150, price: 0.8 },
      { id: 4, name: "Metformin", description: "Used to treat type 2 diabetes", quantity: 90, price: 2.0 },
      { id: 5, name: "Amlodipine", description: "Used to treat high blood pressure", quantity: 60, price: 1.5 },
      { id: 6, name: "Atorvastatin", description: "Used to lower cholesterol", quantity: 80, price: 2.5 },
      { id: 7, name: "Omeprazole", description: "Used to treat acid reflux", quantity: 110, price: 1.0 },
      { id: 8, name: "Cetirizine", description: "Antihistamine for allergies", quantity: 140, price: 0.7 },
      { id: 9, name: "Azithromycin", description: "Antibiotic for various infections", quantity: 50, price: 3.0 },
      { id: 10, name: "Salbutamol", description: "Used for asthma and COPD", quantity: 70, price: 1.8 },
    ])
  }, [])

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText("")
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => this.searchinput.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? <span>{text}</span> : text),
  })

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ]

  const handleAddInventory = () => {
    setIsModalVisible(true)
    form.resetFields()
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // Check for duplicate ID
      if (inventory.some(item => item.id === values.id)) {
        Modal.error({
          title: "Duplicate ID",
          content: "An inventory item with this ID already exists. Please use a unique ID.",
        });
        return;
      }
      setInventory(prev => [...prev, values])
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  return (
    <div>
      <h1>Inventory</h1>
      <Button type="primary" onClick={handleAddInventory} style={{ marginBottom: 16 }}>
        Add Inventory
      </Button>
      <Table columns={columns} dataSource={inventory} loading={loading} rowKey="id" />
      <Modal
        title="Add Inventory Item"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="ID" rules={[{ required: true, message: "Please enter ID" }]}> <Input /> </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter name" }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}> <Input /> </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}> <Input type="number" min={0} /> </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}> <Input type="number" min={0} step={0.01} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Inventory
// export default fetchInventory

