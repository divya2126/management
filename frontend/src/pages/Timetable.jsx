import { useEffect, useState, useCallback } from "react";
import {
  Table, Tag, Button, Modal, Form, Select,
  message, Alert, Tooltip, Popconfirm, Badge, Spin,
} from "antd";
import {
  PlusOutlined, DownloadOutlined, EditOutlined,
  DeleteOutlined, WarningFilled, CheckCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const { Option } = Select;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SLOTS = [
  { label: "Slot 1 · 08:00–09:00", value: "1", start: "08:00 AM", end: "09:00 AM" },
  { label: "Slot 2 · 09:00–10:00", value: "2", start: "09:00 AM", end: "10:00 AM" },
  { label: "Slot 3 · 10:00–11:00", value: "3", start: "10:00 AM", end: "11:00 AM" },
  { label: "Slot 4 · 11:00–12:00", value: "4", start: "11:00 AM", end: "12:00 PM" },
  { label: "Slot 5 · 12:00–13:00", value: "5", start: "12:00 PM", end: "01:00 PM" },
  { label: "Slot 6 · 14:00–15:00", value: "6", start: "02:00 PM", end: "03:00 PM" },
];

const SLOT_COLORS = ["blue", "cyan", "geekblue", "purple", "volcano", "magenta"];

export default function Timetable() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "hod";

  const [timetable, setTimetable]     = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null); // null = create, object = edit
  const [conflictError, setConflictError] = useState(null);
  const [saving, setSaving]           = useState(false);
  const [form]                        = Form.useForm();

  // Dropdowns
  const [courses, setCourses]         = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [rooms, setRooms]             = useState([]);

  // Available teachers (for selected day+slot)
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading]     = useState(false);

  // Watched form values
  const [watchedDay, setWatchedDay]   = useState(null);
  const [watchedSlot, setWatchedSlot] = useState(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchTimetable = useCallback(async () => {
    try {
      const res = await api.get("/timetable");
      const data = res.data.timetable || res.data;
      setTimetable(data);
      formatGrid(data);
    } catch {
      message.error("Failed to load timetable");
    }
  }, []);

  const fetchDropdowns = useCallback(async () => {
    try {
      const [c, s, r] = await Promise.all([
        api.get("/management/courses"),
        api.get("/management/subjects"),
        api.get("/management/rooms"),
      ]);
      setCourses(c.data);
      setAllSubjects(s.data);
      setRooms(r.data);
    } catch {
      message.error("Failed to load dropdown data");
    }
  }, []);

  useEffect(() => {
    fetchTimetable();
    fetchDropdowns();
  }, []);

  // ── Load available teachers whenever day+slot both selected ──────────────
  useEffect(() => {
    if (!canManage || !watchedDay || !watchedSlot) {
      setAvailableTeachers([]);
      return;
    }
    const load = async () => {
      try {
        setTeachersLoading(true);
        const res = await api.get("/timetable/available-teachers", {
          params: { dayOfWeek: watchedDay, slot: watchedSlot },
        });
        setAvailableTeachers(res.data.teachers || []);
      } catch {
        message.error("Could not load teacher availability");
      } finally {
        setTeachersLoading(false);
      }
    };
    load();
  }, [watchedDay, watchedSlot]);

  // ── Watch courseId change → filter subjects ───────────────────────────────
  const onCourseChange = (courseId) => {
    const sub = allSubjects.filter((s) => s.course?._id === courseId || s.course === courseId);
    setFilteredSubjects(sub);
    form.setFieldValue("subjectId", undefined);
  };

  // ── Grid formatter ─────────────────────────────────────────────────────────
  const formatGrid = (data) => {
    const slots = {};
    data.forEach((item) => {
      const key = item.slot;
      const slotMeta = SLOTS.find((s) => s.value === key);
      if (!slots[key]) {
        slots[key] = {
          key,
          slotLabel: slotMeta ? slotMeta.label : `Slot ${key}`,
          _raw: [],
        };
      }
      const day = item.dayOfWeek?.toLowerCase();
      if (!slots[key][day]) slots[key][day] = [];
      slots[key][day].push(item);
      slots[key]._raw.push(item);
    });
    // Sort by slot number
    setFormattedData(Object.values(slots).sort((a, b) => Number(a.key) - Number(b.key)));
  };

  // ── Open modal ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingEntry(null);
    setConflictError(null);
    setAvailableTeachers([]);
    setFilteredSubjects([]);
    setWatchedDay(null);
    setWatchedSlot(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setConflictError(null);
    setWatchedDay(entry.dayOfWeek);
    setWatchedSlot(entry.slot);

    const sub = allSubjects.filter(
      (s) => s.course?._id === entry.courseId?._id || s.course === entry.courseId?._id
    );
    setFilteredSubjects(sub);

    form.setFieldsValue({
      courseId:  entry.courseId?._id,
      subjectId: entry.subjectId?._id,
      teacherId: entry.teacherId?._id,
      roomId:    entry.roomId?._id,
      dayOfWeek: entry.dayOfWeek,
      slot:      entry.slot,
    });
    setIsModalOpen(true);
  };

  // ── Save (create or update) ────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      setConflictError(null);

      const slotMeta = SLOTS.find((s) => s.value === values.slot);
      const payload = {
        ...values,
        startTime: slotMeta?.start,
        endTime:   slotMeta?.end,
      };

      if (editingEntry) {
        await api.put(`/timetable/${editingEntry._id}`, payload);
        message.success("Schedule updated");
      } else {
        await api.post("/timetable", payload);
        message.success("Schedule added");
      }

      setIsModalOpen(false);
      fetchTimetable();
    } catch (err) {
      if (err?.errorFields) return; // validation error
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        setConflictError(serverMsg);
      } else {
        message.error("Failed to save schedule");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/timetable/${id}`);
      message.success("Timetable entry removed");
      fetchTimetable();
    } catch {
      message.error("Failed to delete entry");
    }
  };

  // ── PDF export ─────────────────────────────────────────────────────────────
  const downloadPDF = async () => {
    const element = document.getElementById("timetable-grid");
    if (!element) return;
    try {
      message.loading({ content: "Generating PDF…", key: "pdf" });
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Class_Timetable.pdf");
      message.success({ content: "Timetable downloaded!", key: "pdf" });
    } catch {
      message.error({ content: "Failed to generate PDF.", key: "pdf" });
    }
  };

  // ── Cell renderer ──────────────────────────────────────────────────────────
  const renderCell = (entries, slotKey) => {
    if (!entries || entries.length === 0) {
      return (
        <div className="text-center text-gray-300 text-xs py-2 select-none">—</div>
      );
    }
    return (
      <div className="space-y-1">
        {entries.map((item) => {
          const color = SLOT_COLORS[Number(slotKey) % SLOT_COLORS.length];
          return (
            <div
              key={item._id}
              className="group relative rounded-lg border px-2 py-1.5 text-xs"
              style={{ background: "#f0f5ff", borderColor: "#adc6ff" }}
            >
              {/* Subject + room */}
              <p className="font-semibold text-blue-800 leading-tight truncate">
                {item.subjectId?.name || "—"}
              </p>
              <p className="text-gray-500 mt-0.5 flex items-center gap-1">
                🚪 {item.roomId?.roomNumber || "—"}
              </p>
              {/* Teacher */}
              <p className="text-indigo-600 flex items-center gap-1 mt-0.5 font-medium">
                <UserOutlined /> {item.teacherId?.name || "—"}
              </p>
              {/* Edit / Delete for admins */}
              {canManage && (
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                  <Tooltip title="Edit">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-blue-500 hover:text-blue-700 bg-white rounded p-0.5 shadow"
                    >
                      <EditOutlined style={{ fontSize: 11 }} />
                    </button>
                  </Tooltip>
                  <Popconfirm
                    title="Remove this slot?"
                    onConfirm={() => handleDelete(item._id)}
                    okText="Remove"
                    okButtonProps={{ danger: true }}
                  >
                    <Tooltip title="Delete">
                      <button className="text-red-400 hover:text-red-600 bg-white rounded p-0.5 shadow">
                        <DeleteOutlined style={{ fontSize: 11 }} />
                      </button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = [
    {
      title: "Time Slot",
      dataIndex: "slotLabel",
      key: "slotLabel",
      fixed: "left",
      width: 160,
      render: (label) => (
        <span className="text-xs font-semibold text-gray-600">{label}</span>
      ),
    },
    ...DAYS.map((day) => ({
      title: day,
      dataIndex: day.toLowerCase(),
      key: day,
      width: 160,
      render: (entries, row) => renderCell(entries, row.key),
    })),
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Timetable</h1>
          <p className="text-gray-500 text-sm mt-1">
            {canManage
              ? "Manage weekly class schedules. Conflicts are automatically prevented."
              : "Your weekly class schedule."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button icon={<DownloadOutlined />} onClick={downloadPDF}>
            Export PDF
          </Button>
          {canManage && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ background: "#4f46e5" }}>
              Add Schedule
            </Button>
          )}
        </div>
      </div>

      {/* Legend */}
      {canManage && (
        <div className="flex gap-4 mb-4 text-xs text-gray-500 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <span className="flex items-center gap-1"><CheckCircleFilled className="text-green-500" /> Teacher shown in each cell</span>
          <span className="flex items-center gap-1"><WarningFilled className="text-amber-500" /> Hover a cell to edit or delete</span>
          <span className="flex items-center gap-1">⚡ Teacher dropdown only shows <b>free</b> teachers for selected day+slot</span>
        </div>
      )}

      {/* Grid */}
      <div id="timetable-grid" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={false}
          scroll={{ x: 1100 }}
          rowClassName="align-top"
          bordered
        />
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal
        title={
          <span className="font-bold text-lg">
            {editingEntry ? "✏️ Edit Schedule" : "➕ Add New Schedule"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setConflictError(null); }}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editingEntry ? "Save Changes" : "Add Schedule"}
        okButtonProps={{ style: { background: "#4f46e5" } }}
        width={600}
        destroyOnClose
      >
        {/* Conflict error shown inside modal */}
        {conflictError && (
          <Alert
            message="Scheduling Conflict"
            description={conflictError}
            type="error"
            showIcon
            className="mb-4"
            closable
            onClose={() => setConflictError(null)}
          />
        )}

        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-x-4">

            {/* Day + Slot (row 1) — these drive teacher availability */}
            <Form.Item name="dayOfWeek" label="Day of Week" rules={[{ required: true }]}>
              <Select
                placeholder="Select Day"
                onChange={(v) => { setWatchedDay(v); form.setFieldValue("teacherId", undefined); }}
              >
                {DAYS.map((d) => <Option key={d} value={d}>{d}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="slot" label="Time Slot" rules={[{ required: true }]}>
              <Select
                placeholder="Select Slot"
                onChange={(v) => { setWatchedSlot(v); form.setFieldValue("teacherId", undefined); }}
              >
                {SLOTS.map((s) => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
            </Form.Item>

            {/* Course + Subject (row 2) */}
            <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
              <Select placeholder="Select Course" showSearch optionFilterProp="children" onChange={onCourseChange}>
                {courses.map((c) => <Option key={c._id} value={c._id}>{c.name}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="subjectId" label="Subject" rules={[{ required: true }]}>
              <Select placeholder="Select Subject (pick course first)" showSearch optionFilterProp="children">
                {filteredSubjects.map((s) => <Option key={s._id} value={s._id}>{s.name}</Option>)}
              </Select>
            </Form.Item>

            {/* Teacher — full width, with availability indicator */}
            <Form.Item
              name="teacherId"
              label={
                <span className="flex items-center gap-2">
                  Teacher
                  {teachersLoading && <Spin size="small" />}
                  {!teachersLoading && watchedDay && watchedSlot && (
                    <span className="text-xs text-green-600 font-normal">
                      ({availableTeachers.filter((t) => t.available).length} free)
                    </span>
                  )}
                </span>
              }
              rules={[{ required: true }]}
              className="col-span-2"
            >
              <Select
                placeholder={
                  !watchedDay || !watchedSlot
                    ? "Select Day & Slot first to see availability"
                    : "Select a free teacher"
                }
                showSearch
                optionFilterProp="label"
                disabled={!watchedDay || !watchedSlot}
              >
                {availableTeachers.map((t) => (
                  <Option
                    key={t._id}
                    value={t._id}
                    label={t.name}
                    disabled={!t.available}
                  >
                    <span className="flex items-center justify-between">
                      <span>{t.name}</span>
                      {t.available ? (
                        <Badge status="success" text={<span className="text-xs text-green-600">Free</span>} />
                      ) : (
                        <Badge status="error" text={<span className="text-xs text-red-500">Busy</span>} />
                      )}
                    </span>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Room */}
            <Form.Item name="roomId" label="Room" rules={[{ required: true }]} className="col-span-2">
              <Select placeholder="Select Room" showSearch optionFilterProp="children">
                {rooms.map((r) => (
                  <Option key={r._id} value={r._id}>
                    {r.roomNumber} {r.type ? `· ${r.type}` : ""}
                  </Option>
                ))}
              </Select>
            </Form.Item>

          </div>
        </Form>
      </Modal>
    </div>
  );
}