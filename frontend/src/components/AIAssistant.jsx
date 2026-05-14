import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Spin } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hi there! I am Schedulify AI. You can ask me about your attendance, timetable, or anything else.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: userMessage });
      if (data.success) {
        setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: error.response?.data?.message || 'Sorry, I am having trouble connecting to the server.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickAction = (text) => {
    setMessage(text);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-[999] flex flex-col items-center gap-2">
          <div className="bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-cyan-600 animate-bounce">
            AI Assistant
          </div>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<RobotOutlined style={{ fontSize: '28px' }} />}
            className="w-16 h-16 shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 border-none hover:scale-110 transition-transform"
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.15)] border border-white/40 flex flex-col z-[999] overflow-hidden transition-all transform origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e4a6a] to-[#2a6b9a] p-4 text-white flex justify-between items-center rounded-t-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                <RobotOutlined style={{ fontSize: '20px' }} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide m-0">Schedulify AI</h3>
                <p className="text-[10px] text-cyan-200 m-0 font-medium">Always online</p>
              </div>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined className="text-white hover:text-red-300" />}
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 min-h-[300px] max-h-[400px] space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <RobotOutlined className="text-cyan-600 text-[12px]" />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] p-3 text-sm rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#1e4a6a] text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'ai' ? (
                    <div className="prose prose-sm prose-p:leading-snug prose-p:my-0 prose-strong:text-cyan-700">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start items-center gap-2 text-gray-400">
                <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                  <RobotOutlined className="text-cyan-600 text-[12px]" />
                </div>
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2 pt-2 bg-gray-50/80 flex gap-2 overflow-x-auto scrollbar-none border-t border-gray-100">
            <span 
              onClick={() => quickAction("What is my attendance?")}
              className="whitespace-nowrap text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-cyan-100 transition-colors"
            >
              My Attendance
            </span>
            <span 
              onClick={() => quickAction("What classes do I have today?")}
              className="whitespace-nowrap text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-purple-100 transition-colors"
            >
              Today's Schedule
            </span>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Ask me anything..."
              className="rounded-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-gray-200 focus:border-cyan-500 py-2 pr-12 shadow-inner text-sm"
              suffix={
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<SendOutlined className="text-[12px]" />} 
                  onClick={handleSend}
                  loading={loading}
                  className="bg-[#1e4a6a] hover:bg-[#2a6b9a] border-none shadow-sm absolute right-1 top-1 w-8 h-8 flex items-center justify-center"
                />
              }
            />
          </div>

        </div>
      )}
    </>
  );
}
