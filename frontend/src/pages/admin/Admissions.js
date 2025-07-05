import { useState, useEffect } from "react";
import { Table, Button, message, Tag } from "antd";

const statusColors = {
  Admitted: "blue",
  Requested: "orange",
  Pending: "gold",
  Discharged: "green",
  Transferred: "purple",
};

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/admissions", { credentials: "include" });
      const result = await response.json();
      if (result.success) {
        setAdmissions(result.data);
      } else {
        setAdmissions([]);
        message.error("Failed to fetch admissions");
      }
    } catch (error) {
      console.error("Error fetching admissions:", error);
      setAdmissions([]);
      message.error("Failed to fetch admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleDischarge = async (admissionId) => {
    try {
      const response = await fetch(`/api/admin/admissions/${admissionId}/discharge`, {
        method: "PUT",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        message.success("Patient discharged successfully");
        fetchAdmissions();
      } else {
        message.error(result.message || "Failed to discharge patient");
      }
    } catch (error) {
      console.error("Error discharging patient:", error);
      message.error("Failed to discharge patient");
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Bed Number",
      dataIndex: "bedNumber",
      key: "bedNumber",
    },
    {
      title: "Ward",
      dataIndex: "ward",
      key: "ward",
    },
    {
      title: "Bed Type",
      dataIndex: "bedType",
      key: "bedType",
    },
    {
      title: "Admission Date",
      dataIndex: "admissionDate",
      key: "admissionDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || "default"}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const canDischarge =
          ["Admitted", "Requested", "Pending"].includes(record.status) && !record.dischargeDate;
        return canDischarge ? (
          <Button type="primary" danger onClick={() => handleDischarge(record._id)}>
            Discharge
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <div>
      <h1>Admissions Management</h1>
      <Table
        columns={columns}
        dataSource={admissions}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Admissions; 