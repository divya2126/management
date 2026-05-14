import React, { useState, useEffect } from "react";
import { Table, Spin, Tag, Card, message } from "antd";
import { FileDoneOutlined, TrophyOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyResults();
  }, []);

  const fetchMyResults = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/results/my-results", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setResults(data);
    } catch (error) {
      message.error("Failed to load your results");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Exam",
      dataIndex: ["exam", "title"],
      key: "examTitle",
      render: (text, record) => (
        <div>
          <div className="font-semibold text-[#1e4a6a]">{text}</div>
          <div className="text-xs text-gray-400">{record.exam?.examType}</div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: ["subject", "name"],
      key: "subjectName",
      render: (text, record) => (
        <span>
          {text} <span className="text-gray-400 text-xs ml-1">({record.subject?.code})</span>
        </span>
      ),
    },
    {
      title: "Marks",
      key: "marks",
      render: (_, record) => (
        <span className="font-medium text-gray-700">
          {record.marksObtained} <span className="text-gray-400 font-normal">/ {record.totalMarks}</span>
        </span>
      ),
    },
    {
      title: "Percentage",
      key: "percentage",
      render: (_, record) => {
        const pct = ((record.marksObtained / record.totalMarks) * 100).toFixed(1);
        return <span className="text-gray-600 font-medium">{pct}%</span>;
      },
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      align: "center",
      render: (grade) => {
        let color = "blue";
        if (["A+", "A"].includes(grade)) color = "gold";
        if (["B+", "B"].includes(grade)) color = "green";
        if (["C", "D"].includes(grade)) color = "orange";
        if (["F", "Absent"].includes(grade)) color = "red";
        
        return <Tag color={color} className="font-bold w-12 text-center text-sm m-0">{grade}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Pass" ? "success" : "error"} className="rounded-full px-3">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text) => <span className="text-gray-500 italic text-sm">{text || "-"}</span>,
    },
  ];

  // Calculate overall stats
  const totalExams = results.length;
  const passedExams = results.filter((r) => r.status === "Pass").length;
  const failedExams = totalExams - passedExams;

  let overallPct = 0;
  if (totalExams > 0) {
    const totalMarksObtained = results.reduce((acc, r) => acc + r.marksObtained, 0);
    const totalMaxMarks = results.reduce((acc, r) => acc + r.totalMarks, 0);
    overallPct = ((totalMarksObtained / totalMaxMarks) * 100).toFixed(1);
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-[#1e4a6a] m-0 flex items-center gap-2">
            <FileDoneOutlined className="text-cyan-500" />
            My Academic Results
          </h1>
          <p className="text-gray-500 mt-1">View your marks and performance across all examinations.</p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Spin size="large" />
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400">
            <TrophyOutlined className="text-6xl text-gray-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No results found</h3>
            <p className="text-sm text-gray-400">Your teachers haven't uploaded any marks for you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Stats Sidebar */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <Card className="rounded-2xl shadow-sm border-gray-100 text-center bg-gradient-to-br from-[#1e4a6a] to-[#2a6b9a] text-white border-none">
                <TrophyOutlined className="text-4xl text-cyan-300 mb-2 opacity-80" />
                <h3 className="text-sm text-cyan-100 m-0 uppercase tracking-wider font-semibold">Overall Score</h3>
                <div className="text-4xl font-bold mt-1">{overallPct}%</div>
              </Card>

              <Card className="rounded-2xl shadow-sm border-gray-100">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">Exams Taken</span>
                  <span className="font-bold text-gray-800">{totalExams}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-500">Passed</span>
                  <span className="font-bold text-green-600">{passedExams}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Failed</span>
                  <span className="font-bold text-red-500">{failedExams}</span>
                </div>
              </Card>
            </div>

            {/* Main Table */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Table
                dataSource={results}
                columns={columns}
                rowKey="_id"
                pagination={false}
                className="custom-table"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
