import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InstructorChat.css';
import { useSelector } from 'react-redux'; 
import {useFetchStudentsQuery} from '../../store/instructorApiSlice';
import {useSendMessageMutation, useGetLiveUpdatesQuery } from '../../store/userApiSlice'; 
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function InstructorChatApp() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: students, isFetching: fetchingStudents, isError } = useFetchStudentsQuery(); 
  const [sendMessage] = useSendMessageMutation();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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
  
  useEffect(() => {
    if (selectedStudent) {
      socket.emit('joinChat', selectedStudent._id);
  
      socket.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  
    return () => {
      socket.off('receiveMessage'); 
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
<div className="container container-fluid py-4">
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
                <p>Active now</p>
              </div>
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
            <p>Active Now</p>
          </div>
          <div className="chat-body" ref={chatBodyRef} style={{ overflowY: 'auto', minHeight: '70vh',maxHeight: '70vh' }}>
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
