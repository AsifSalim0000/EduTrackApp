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
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingStatuses, setTypingStatuses] = useState({});
  const chatBodyRef = useRef(null);

  const { data: liveUpdates, isFetching: fetchingMessages } = useGetLiveUpdatesQuery({
    chatId: selectedTeacher?._id, 
    receiverId: selectedTeacher?.userId?._id,
  }, {
    skip: !selectedTeacher, 
  });

  
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.on('typing', ({ senderId }) => {
      setTypingStatuses((prevStatuses) => ({
        ...prevStatuses,
        [senderId]: true,
      }));
    });

    socket.on('stopTyping', ({ senderId }) => {
      setTypingStatuses((prevStatuses) => ({
        ...prevStatuses,
        [senderId]: false,
      }));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('onlineUsers');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      socket.emit('joinChat', selectedTeacher._id);

      socket.on('typing', ({ senderId }) => {
        setTypingStatuses((prevStatuses) => ({
          ...prevStatuses,
          [senderId]: true,
        }));
      });

      socket.on('stopTyping', ({ senderId }) => {
        setTypingStatuses((prevStatuses) => ({
          ...prevStatuses,
          [senderId]: false,
        }));
      });
    }

    return () => {
      if (selectedTeacher) {
        socket.off('typing');
        socket.off('stopTyping');
      }
    };
  }, [selectedTeacher]);

  const handleSendMessage = async () => {
    if (newMessage && selectedTeacher) {
      const messageData = {
        sender: userInfo._id, 
        content: newMessage,
        chatId: selectedTeacher._id, 
        receiverId: selectedTeacher.userId._id,
      };
  
      const { data } = await sendMessage(messageData); 
      socket.emit('sendMessage', data);
      setMessages((prevMessages) => [...prevMessages]);
      setNewMessage('');  
      socket.emit('stopTyping', selectedTeacher.userId._id); // Stop typing when message is sent
    }
  };

  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTyping = (value) => {
    setNewMessage(value);
  
    if (selectedTeacher) {
      socket.emit('typing', {
        senderId: userInfo._id,
        receiverId: selectedTeacher.userId._id, // Include selected teacher's ID
      });
    }
  
    clearTimeout(typingTimeout);
  
    setTypingTimeout(
      setTimeout(() => {
        if (selectedTeacher) {
          socket.emit('stopTyping', {
            senderId: userInfo._id,
            receiverId: selectedTeacher.userId._id, // Include selected teacher's ID
          });
        }
      }, 1000)
    );
  };

  useEffect(() => {
    if (selectedTeacher) {
      socket.emit('joinChat', { userId: userInfo._id, chatId: selectedTeacher.userId._id });

      return () => {
        socket.off('receiveMessage');
        socket.off('onlineUsers');
      };
    }
  }, [selectedTeacher, userInfo._id]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

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
      <div className="chat row">
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
                  key={teacher.userId._id}
                  className={`list-group-item ${selectedTeacher?.userId._id === teacher.userId._id ? 'active-user' : 'user-inactive'}`}
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
                    <p>{onlineUsers[teacher.userId._id] ? 'Online' : 'Offline'}</p>
                    {typingStatuses[teacher.userId._id] && (
                      <p className="text-warning typing-indicator">
                        Typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                      </p>
                    )}
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
                <p>{onlineUsers[selectedTeacher.userId._id] ? 'Online' : 'Offline'}</p>
                {typingStatuses[selectedTeacher.userId._id] && (
                  <p className="text-warning typing-indicator">
                    Typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                  </p>
                )}
              </div>
              <div className="chat-body" ref={chatBodyRef} style={{ overflowY: 'auto', minHeight: '70vh', maxHeight: '70vh' }}>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender._id === userInfo._id ? 'sent' : 'received'}`}>
                    {msg.content}
                    <span className="message-timestamp">{formatTime(msg.createdAt)}</span>
                  </div>
                ))}
              </div>
              <div className="chat-footer p-3 d-flex">
                <input 
                  type="text"
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                />
                <button className="btn btn-primary ms-2" onClick={handleSendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="no-chat">
              <p>Select a teacher to start chatting!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
