import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InstructorChat.css';
import { useSelector } from 'react-redux';
import { useFetchStudentsQuery } from '../../store/instructorApiSlice';
import { useSendMessageMutation, useGetLiveUpdatesQuery } from '../../store/userApiSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function InstructorChatApp() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: students, isFetching: fetchingStudents, isError } = useFetchStudentsQuery();
  const [sendMessage] = useSendMessageMutation();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingStatus, setTypingStatus] = useState({}); // To track typing per student
  
  const chatBodyRef = useRef(null);

  const { data: liveUpdates, isFetching: fetchingMessages } = useGetLiveUpdatesQuery({
    chatId: selectedStudent?._id,
    receiverId: selectedStudent?._id,
  }, {
    skip: !selectedStudent,
  });

  const handleSendMessage = async () => {
    if (newMessage && selectedStudent) {
      const messageData = {
        sender: userInfo._id,
        content: newMessage,
        chatId: selectedStudent._id,
        receiverId: selectedStudent._id,
      };

      const { data } = await sendMessage(messageData);
      socket.emit('sendMessage', data);
      setMessages((prevMessages) => [...prevMessages]);
      setNewMessage('');
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    if (selectedTeacher) {
      socket.emit('typing', {
        senderId: userInfo._id, // Your ID
        receiverId: selectedTeacher.userId._id, // Selected teacher's ID
        chatId: selectedTeacher._id, // Chat ID
      });
    }
  };
  

  useEffect(() => {
    if (selectedStudent) {
      socket.emit('joinChat', selectedStudent._id);

      socket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      socket.on('typing', (studentId) => {
        setTypingStatus((prevStatus) => ({
          ...prevStatus,
          [studentId]: true, // Set typing status for this student
        }));
      });

      socket.on('stopTyping', (studentId) => {
        setTypingStatus((prevStatus) => ({
          ...prevStatus,
          [studentId]: false, // Reset typing status for this student
        }));
      });

      socket.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socket.off('receiveMessage');
      socket.off('onlineUsers');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [selectedStudent]);

  // Scroll to bottom whenever messages are updated
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]); // Trigger whenever messages array changes

  // Update messages whenever liveUpdates are fetched
  useEffect(() => {
    if (liveUpdates && !fetchingMessages) {
      setMessages(liveUpdates);
    }
  }, [liveUpdates, fetchingMessages]);

  const formatTime = (timeString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(timeString).toLocaleTimeString([], options);
  };

  return (
    <div className="container container-fluid py-4 bg-light shadow">
      <div className="instructor-chat row">
        <div className="col-md-3 instructor-chat-sidebar p-0">
          <div className="sidebar-header p-3">
            <input className="form-control search-input" type="text" placeholder="Search" />
          </div>
          <div className="list-group user-list">
            {fetchingStudents ? (
              <p>Loading students...</p>
            ) : isError ? (
              <p>Failed to fetch students. Please try again later.</p>
            ) : students?.length === 0 ? (
              <p>No students found.</p>
            ) : (
              students.map((student) => (
                <button
                  key={student._id}
                  className={`list-group-item ${selectedStudent?._id === student._id ? 'active-user' : 'user-inactive'}`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="user-avatar">
                    <img 
                      src={`/src/assets/uploads/${student.profileImage}`} 
                      alt=""
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                    />
                  </div>
                  <div className="user-info">
                    <h6>{student.username}</h6>
                    <p>{onlineUsers[student._id] ? 'Online' : 'Offline'}</p>
                  </div>
                  {typingStatus[student._id] && <p>{student.username} is typing...</p>}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="col-md-9 instructor-chat-window h-100">
          {selectedStudent ? (
            <>
              <div className="chat-header p-3">
                <h5>{selectedStudent.username}</h5>
                <p>{onlineUsers[selectedStudent._id] ? 'Online' : 'Offline'}</p>
              </div>
              <div className="chat-body" ref={chatBodyRef} style={{ overflowY: 'auto', minHeight: '70vh', maxHeight: '70vh' }}>
              {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender._id === userInfo._id ? 'sent' : 'received'}`}>
                {msg.content}
                <span className="message-timestamp">{formatTime(msg.createdAt)}</span>
              </div>
            ))}
                
              </div>
              <div className="chat-footer p-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onFocus={handleTyping}
                  onKeyPress={handleTyping}
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <p>Select a student to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorChatApp;
