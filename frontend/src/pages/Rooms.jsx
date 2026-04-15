import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Option } = Select;

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchRooms = async () => {
    try {
      const res = await api.get("/management/rooms");
      setRooms(res.data);
    } catch (err) {
      message.error("Failed to fetch rooms");
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ type: "classroom", capacity: 60 });
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      roomNumber: record.roomNumber,
      capacity: record.capacity,
      type: record.type,
      specialEquipmentStr: Array.isArray(record.specialEquipment)
        ? record.specialEquipment.join(", ")
        : record.specialEquipment || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Convert comma-string → array
      values.specialEquipment = values.specialEquipmentStr
        ? values.specialEquipmentStr.split(",").map((i) => i.trim()).filter(Boolean)
        : [];

      if (editingRecord) {
        await api.put(`/management/rooms/${editingRecord._id}`, values);
        message.success("Room updated successfully");
      } else {
        await api.post("/management/rooms", values);
        message.success("Room added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchRooms();
    } catch (err) {
      message.error(err.response?.data?.message || "Error saving room");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/management/rooms/${id}`);
      message.success("Room deleted");
      fetchRooms();
    } catch (err) {
      message.error("Failed to delete room");
    }
  };

  const columns = [
    { title: "Room Number", dataIndex: "roomNumber", key: "roomNumber", render: (text) => <span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block font-bold">{text}</span> },
    { title: "Capacity", dataIndex: "capacity", key: "capacity", render: (c) => `${c} Seats` },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "lab" ? "orange" : "blue"} className="uppercase font-semibold tracking-wide border-none px-2 rounded">
          {type}
        </Tag>
      ),
    },
    {
      title: "Special Equipment",
      dataIndex: "specialEquipment",
      key: "specialEquipment",
      render: (equipment) => (
        <>
          {equipment && equipment.map((eq, i) => <Tag key={i} color="default">{eq}</Tag>)}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="Delete this room?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rooms &amp; Labs</h1>
          <p className="text-gray-500 mt-1">Manage physical infrastructure and lab capacities</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreate}>
          Add Room
        </Button>
      </div>

      <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table dataSource={rooms} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />
      </div>

      <Modal
        title={<h3 className="text-lg font-bold">{editingRecord ? "Edit Room" : "Add New Room"}</h3>}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="roomNumber" label="Room Number" rules={[{ required: true, message: "Required" }]}>
              <Input size="large" placeholder="e.g. Room 101" className="uppercase" />
            </Form.Item>
            <Form.Item name="capacity" label="Seat Capacity" rules={[{ required: true, message: "Required" }]}>
              <InputNumber size="large" min={1} max={500} className="w-full" placeholder="e.g. 60" />
            </Form.Item>
          </div>
          <Form.Item name="type" label="Room Type" rules={[{ required: true, message: "Required" }]}>
            <Select size="large">
              <Option value="classroom">General Classroom</Option>
              <Option value="lab">Laboratory</Option>
            </Select>
          </Form.Item>
          <Form.Item name="specialEquipmentStr" label="Special Equipment (Optional)" tooltip="Comma-separated list (e.g. Projector, High-End PCs)">
            <Input.TextArea rows={2} placeholder="e.g. Chemistry Lab Setup, Projector, Macs" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full mt-2">
            {editingRecord ? "Update Room" : "Save Room"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
