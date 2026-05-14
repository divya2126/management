import React, { useState, useEffect } from "react";
import { Table, Select, Button, InputNumber, Input, message, Spin, Tag } from "antd";
import { BookOutlined, CheckCircleOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";

const { Option } = Select;

export default function ManageResults() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [existingResults, setExistingResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Marks state: { studentId: { marksObtained, remarks } }
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchStudentsAndResults(selectedExam);
    } else {
      setStudents([]);
      setMarksData({});
    }
  }, [selectedExam]);

  const fetchExams = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/exams", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExams(data.data || []);
    } catch (error) {
      message.error("Failed to load exams");
    }
  };

  const fetchStudentsAndResults = async (examId) => {
    setLoading(true);
    try {
      // 1. Fetch all students
      const studentRes = await axios.get("http://localhost:5001/api/students", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const allStudents = studentRes.data?.data || [];

      // 2. Fetch existing results for this exam
      const resultsRes = await axios.get(`http://localhost:5001/api/results/exam/${examId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const resultsMap = {};
      resultsRes.data.forEach((r) => {
        resultsMap[r.student._id || r.student] = r;
      });

      setStudents(allStudents);
      setExistingResults(resultsMap);

      // Initialize marksData with existing results
      const initialMarks = {};
      allStudents.forEach((student) => {
        if (resultsMap[student._id]) {
          initialMarks[student._id] = {
            marksObtained: resultsMap[student._id].marksObtained,
            remarks: resultsMap[student._id].remarks || "",
          };
        } else {
          initialMarks[student._id] = { marksObtained: null, remarks: "" };
        }
      });
      setMarksData(initialMarks);

    } catch (error) {
      message.error("Failed to load students or results");
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], marksObtained: value },
    }));
  };

  const handleRemarksChange = (studentId, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks: value },
    }));
  };

  const handleSave = async () => {
    if (!selectedExam) return;

    // Filter out rows where marks haven't been entered yet
    const resultsToSave = Object.keys(marksData)
      .filter((studentId) => marksData[studentId].marksObtained !== null && marksData[studentId].marksObtained !== undefined)
      .map((studentId) => ({
        studentId,
        marksObtained: marksData[studentId].marksObtained,
        remarks: marksData[studentId].remarks,
      }));

    if (resultsToSave.length === 0) {
      message.warning("Please enter marks for at least one student before saving.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        "http://localhost:5001/api/results/upload",
        { examId: selectedExam, results: resultsToSave },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      message.success("Results saved successfully!");
      fetchStudentsAndResults(selectedExam); // Refresh to get auto-calculated grades
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  const examDetails = exams.find((e) => e._id === selectedExam);

  const columns = [
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-[#1e4a6a]">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => text ? <Tag color="blue">{text}</Tag> : <Tag>N/A</Tag>
    },
    {
      title: `Marks Obtained (Out of ${examDetails?.maxMarks || 100})`,
      key: "marks",
      width: 200,
      render: (_, record) => (
        <InputNumber
          min={0}
          max={examDetails?.maxMarks || 100}
          value={marksData[record._id]?.marksObtained}
          onChange={(val) => handleMarksChange(record._id, val)}
          placeholder="Enter marks"
          className="w-full rounded-md"
        />
      ),
    },
    {
      title: "Remarks (Optional)",
      key: "remarks",
      width: 250,
      render: (_, record) => (
        <Input
          placeholder="e.g. Needs improvement"
          value={marksData[record._id]?.remarks}
          onChange={(e) => handleRemarksChange(record._id, e.target.value)}
          className="rounded-md"
        />
      ),
    },
    {
      title: "Current Status",
      key: "status",
      width: 150,
      render: (_, record) => {
        const res = existingResults[record._id];
        if (!res) return <Tag color="default">Not Graded</Tag>;
        return res.status === "Pass" ? (
          <Tag color="success">Pass ({res.grade})</Tag>
        ) : (
          <Tag color="error">Fail ({res.grade})</Tag>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-[#1e4a6a] m-0 flex items-center gap-2">
              <BookOutlined className="text-cyan-500" />
              Manage Results
            </h1>
            <p className="text-gray-500 mt-1">Upload and edit student marks for examinations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-72">
              <Select
                placeholder="Select an Exam..."
                className="w-full shadow-sm"
                size="large"
                onChange={(val) => setSelectedExam(val)}
                options={exams.map((ex) => ({
                  value: ex._id,
                  label: `${ex.title} (${ex.examType})`,
                }))}
                showSearch
                optionFilterProp="label"
              />
            </div>
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              disabled={!selectedExam}
              className="bg-cyan-500 hover:!bg-cyan-600 border-none shadow-md rounded-lg font-semibold"
            >
              Save Results
            </Button>
          </div>
        </div>

        {selectedExam ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                dataSource={students}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ y: 600 }}
                className="custom-table"
              />
            )}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400">
            <CheckCircleOutlined className="text-6xl text-cyan-100 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">Please select an Exam from the dropdown above</h3>
            <p className="text-sm text-gray-400">The student list will appear here allowing you to enter their marks.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
