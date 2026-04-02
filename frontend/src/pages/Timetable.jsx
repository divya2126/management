import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // dropdown data
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // 🔥 FETCH ALL DATA
  const fetchData = async () => {
    try {
      const [tt, c, s, t, r] = await Promise.all([
        axios.get("http://localhost:5001/api/timetable"),
        axios.get("http://localhost:5001/api/courses"),
        axios.get("http://localhost:5001/api/subjects"),
        axios.get("http://localhost:5001/api/teachers"),
        axios.get("http://localhost:5001/api/rooms"),
      ]);

      setTimetable(tt.data);
      setCourses(c.data);
      setSubjects(s.data);
      setTeachers(t.data);
      setRooms(r.data);

      formatTimetable(tt.data);
    } catch (err) {
      console.log(err);
      message.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 FORMAT DATA INTO GRID
  const formatTimetable = (data) => {
    const slots = {};

    data.forEach((item) => {
      const slotKey = item.slot;

      if (!slots[slotKey]) {
        slots[slotKey] = {
          key: slotKey,
          time: `${item.startTime} - ${item.endTime}`,
        };
      }

      slots[slotKey][item.dayOfWeek.toLowerCase()] = (
        <Tag color="blue">
          {item.subjectId?.name} ({item.roomId?.roomNumber})
        </Tag>
      );
    });

    setFormattedData(Object.values(slots));
  };

  // 🔥 ADD TIMETABLE
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      await axios.post("http://localhost:5001/api/timetable", values);

      message.success("Schedule added");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error(err?.response?.data?.message || "Error");
    }
  };

  // 🔥 TABLE COLUMNS
  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      fixed: "left",
      width: 140,
    },
    {
      title: "Monday",
      dataIndex: "monday",
    },
    {
      title: "Tuesday",
      dataIndex: "tuesday",
    },
    {
      title: "Wednesday",
      dataIndex: "wednesday",
    },
    {
      title: "Thursday",
      dataIndex: "thursday",
    },
    {
      title: "Friday",
      dataIndex: "friday",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">Timetable</h1>
      <p className="text-gray-500 mb-6">
        Manage weekly class schedules.
      </p>

      {/* ADD BUTTON */}
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Schedule
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border">
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </div>

      {/* MODAL */}
      <Modal
        title="Add Schedule"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
            <Select
              options={courses.map((c) => ({
                label: c.name,
                value: c._id,
              }))}
            />
          </Form.Item>

          <Form.Item name="subjectId" label="Subject" rules={[{ required: true }]}>
            <Select
              options={subjects.map((s) => ({
                label: s.name,
                value: s._id,
              }))}
            />
          </Form.Item>

          <Form.Item name="teacherId" label="Teacher" rules={[{ required: true }]}>
            <Select
              options={teachers.map((t) => ({
                label: t.name,
                value: t._id,
              }))}
            />
          </Form.Item>

          <Form.Item name="roomId" label="Room" rules={[{ required: true }]}>
            <Select
              options={rooms.map((r) => ({
                label: r.roomNumber,
                value: r._id,
              }))}
            />
          </Form.Item>

          <Form.Item name="dayOfWeek" label="Day" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Monday", value: "Monday" },
                { label: "Tuesday", value: "Tuesday" },
                { label: "Wednesday", value: "Wednesday" },
                { label: "Thursday", value: "Thursday" },
                { label: "Friday", value: "Friday" },
              ]}
            />
          </Form.Item>

          <Form.Item name="slot" label="Slot" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Slot 1", value: "1" },
                { label: "Slot 2", value: "2" },
                { label: "Slot 3", value: "3" },
                { label: "Slot 4", value: "4" },
              ]}
            />
          </Form.Item>

          <Form.Item name="startTime" label="Start Time">
            <Select
              options={[
                { label: "09:00 AM", value: "09:00 AM" },
                { label: "10:00 AM", value: "10:00 AM" },
                { label: "11:00 AM", value: "11:00 AM" },
              ]}
            />
          </Form.Item>

          <Form.Item name="endTime" label="End Time">
            <Select
              options={[
                { label: "10:00 AM", value: "10:00 AM" },
                { label: "11:00 AM", value: "11:00 AM" },
                { label: "12:00 PM", value: "12:00 PM" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}