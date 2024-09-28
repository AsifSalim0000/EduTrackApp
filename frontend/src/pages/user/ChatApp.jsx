import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';
import { useSelector } from 'react-redux'; 
import { useFetchTeachersQuery, useSendMessageMutation, useGetLiveUpdatesQuery } from '../../store/userApiSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function ChatApp() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: teachers, isFetching: fetchingTeachers, isError } = useFetchTeachersQuery(); 
  const [sendMessage] = useSendMessageMutation();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Reference to the chat body (for scrolling)
  const chatBodyRef = useRef(null);

  const { data: liveUpdates, isFetching: fetchingMessages } = useGetLiveUpdatesQuery({
    chatId: selectedTeacher?._id, 
    instructorId: selectedTeacher?.userId?._id,
  }, {
    skip: !selectedTeacher, 
  });

  const handleSendMessage = async () => {
    if (newMessage && selectedTeacher) {
      const messageData = {
        sender: userInfo._id, 
        content: newMessage,
        chatId: selectedTeacher._id, 
        instructorId: selectedTeacher.userId._id,
      };
  
      const { data } = await sendMessage(messageData); 
      socket.emit('sendMessage', data);
      setMessages((prevMessages) => [...prevMessages, data]); // Update local messages
      setNewMessage('');  
    }
  };
  
  useEffect(() => {
    if (selectedTeacher) {
      socket.emit('joinChat', selectedTeacher._id);
  
      socket.on('receiveMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  
    return () => {
      socket.off('receiveMessage'); 
    };
  }, [selectedTeacher]);

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
    <div className="container-fluid py-4">
      <div className="chat-container row">
        <div className="col-md-3 chat-sidebar p-0">
          <div className="sidebar-header p-3">
            <input className="form-control search-input" type="text" placeholder="Search" />
          </div>
          <div className="list-group user-list">
            {fetchingTeachers ? (
              <p>Loading teachers...</p>
            ) : isError ? (
              <p>Failed to fetch teachers. Please try again later.</p>
            ) : teachers?.length === 0 ? (
              <p>No teachers found.</p>
            ) : (
              teachers.map((teacher) => (
                <button
                  key={teacher._id}
                  className={`list-group-item ${selectedTeacher?._id === teacher._id ? 'active-user' : 'user-inactive'}`}
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <div className="user-avatar">
                    <img 
                      src={`/src/assets/uploads/${teacher.userId.profileImage}`} 
                      alt=""
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                    />
                  </div>
                  <div className="user-info">
                    <h6>{teacher.userId.username}</h6>
                    <p>Active now</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="col-md-9 chat-window h-100">
          {selectedTeacher ? (
            <>
              <div className="chat-header p-3">
                <h5>{selectedTeacher.userId.username}</h5>
                <p>Active Now</p>
              </div>
              <div className="chat-body" ref={chatBodyRef} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
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
            <p>Select a teacher to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
