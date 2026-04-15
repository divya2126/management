import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Tag, Spin, Empty, Input, Select, Badge } from 'antd';
import {
  BellOutlined,
  ExclamationCircleFilled,
  InfoCircleFilled,
  CheckCircleFilled,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import api from '../services/api';

dayjs.extend(relativeTime);

const { Search } = Input;
const { Option } = Select;

const TYPE_CONFIG = {
  general: {
    icon: <InfoCircleFilled style={{ color: '#3b82f6', fontSize: 20 }} />,
    bg: '#eff6ff',
    border: '#bfdbfe',
    badgeColor: 'blue',
    label: 'General',
  },
  urgent: {
    icon: <ExclamationCircleFilled style={{ color: '#ef4444', fontSize: 20 }} />,
    bg: '#fef2f2',
    border: '#fecaca',
    badgeColor: 'red',
    label: 'Urgent',
  },
  leave: {
    icon: <CheckCircleFilled style={{ color: '#22c55e', fontSize: 20 }} />,
    bg: '#f0fdf4',
    border: '#bbf7d0',
    badgeColor: 'green',
    label: 'Leave Notice',
  },
};

export default function Notifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [search, setSearch]               = useState('');
  const [typeFilter, setTypeFilter]       = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, search, typeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...notifications];

    if (typeFilter !== 'all') {
      result = result.filter(n => n.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n => n.message.toLowerCase().includes(q));
    }

    setFiltered(result);
  };

  // Counts for each type
  const urgentCount  = notifications.filter(n => n.type === 'urgent').length;
  const generalCount = notifications.filter(n => n.type === 'general').length;
  const leaveCount   = notifications.filter(n => n.type === 'leave').length;

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BellOutlined className="text-indigo-600" />
            Notifications
            {urgentCount > 0 && (
              <Badge count={urgentCount} style={{ background: '#ef4444' }} />
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Broadcast messages from your institution
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ReloadOutlined spin={loading} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'General', count: generalCount, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Urgent',  count: urgentCount,  color: '#ef4444', bg: '#fef2f2' },
          { label: 'Leave',   count: leaveCount,   color: '#22c55e', bg: '#f0fdf4' },
        ].map(({ label, count, color, bg }) => (
          <div
            key={label}
            className="rounded-xl p-4 shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition-shadow"
            style={{ background: bg }}
            onClick={() => setTypeFilter(label.toLowerCase())}
          >
            <p className="text-2xl font-bold" style={{ color }}>{count}</p>
            <p className="text-sm font-medium mt-1" style={{ color }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <Search
          placeholder="Search notifications..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 280 }}
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 180 }}
        >
          <Option value="all">All Types</Option>
          <Option value="general">General</Option>
          <Option value="urgent">Urgent</Option>
          <Option value="leave">Leave Notice</Option>
        </Select>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Loading notifications..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-gray-500 font-medium">No notifications found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {search || typeFilter !== 'all'
                    ? 'Try clearing your filters.'
                    : 'You\'re all caught up!'}
                </p>
              </div>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif, index) => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.general;
            const isUrgent = notif.type === 'urgent';

            return (
              <div
                key={notif._id || index}
                className="flex gap-4 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md"
                style={{
                  background: cfg.bg,
                  borderColor: cfg.border,
                  borderLeft: `4px solid ${isUrgent ? '#ef4444' : isUrgent ? '#22c55e' : '#3b82f6'}`,
                }}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {cfg.icon}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-gray-800 font-medium leading-snug">
                      {notif.message}
                    </p>
                    <Tag color={cfg.badgeColor} className="flex-shrink-0 text-xs">
                      {cfg.label}
                    </Tag>
                  </div>

                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {notif.senderId?.name && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="inline-block w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center uppercase">
                          {notif.senderId.name[0]}
                        </span>
                        {notif.senderId.name}
                        {notif.senderId.role && (
                          <span className="text-gray-400 capitalize">({notif.senderId.role})</span>
                        )}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {dayjs(notif.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
