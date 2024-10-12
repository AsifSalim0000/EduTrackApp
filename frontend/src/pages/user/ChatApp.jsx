import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chat.css';
import { useSelector } from 'react-redux'; 
import { useFetchTeachersQuery, useSendMessageMutation, useGetLiveUpdatesQuery,useDeleteMessageMutation } from '../../store/userApiSlice';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import { BsFillMicFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); 
  const chatBodyRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [deleteMessage] = useDeleteMessageMutation();

  const { data: liveUpdates, isFetching: fetchingMessages } = useGetLiveUpdatesQuery({
    chatId: selectedTeacher?._id, 
    receiverId: selectedTeacher?.userId?._id,
  }, {
    skip: !selectedTeacher, 
  });

  
  useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      toast.success('Message recieved!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
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
      socket.emit('stopTyping', selectedTeacher.userId._id); 
      
    }
  };

  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTyping = (value) => {
    setNewMessage(value);
  
    if (selectedTeacher) {
      socket.emit('typing', {
        senderId: userInfo._id,
        receiverId: selectedTeacher.userId._id, 
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
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const handleStartRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorderRef.current.ondataavailable = e => chunks.push(e.data);
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob); // Save recorded audio
          setIsRecording(false);
        };
        mediaRecorderRef.current.start();
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
        setIsRecording(false);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handleSendAudioMessage = () => {
    if (audioBlob && selectedTeacher) {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audioMessage.wav');
      formData.append('sender', userInfo._id);
      formData.append('chatId', selectedTeacher._id);
      formData.append('receiverId', selectedTeacher.userId._id);

      sendMessage(formData);
      socket.emit('sendMessage', { ...formData, contentType: 'audio' });
      setAudioBlob(null); 
    }
  };
  const handleSelectMessage = (msg) => {
    Swal.fire({
      title: 'Do you want to delete this message?',
      text: "This will delete the message for everyone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteMessage(msg._id); 
      }
    });
  };
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId).unwrap(); 
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== messageId)); 
      socket.emit('deleteMessage',  messageId, selectedTeacher._id);
      Swal.fire(
        'Deleted!',
        'The message has been deleted for everyone.',
        'success'
      );
    } catch (error) {
      Swal.fire(
        'Error!',
        'There was an error deleting the message. Please try again later.',
        'error'
      );
    }
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
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on('messageDeleted', (deletedMessageId) => {
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== deletedMessageId));
    });

    return () => {
      socket.off('messageDeleted');
    };
  }, []);



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
        <div className="col-sm-5 col-md-3 chat-sidebar p-0">
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
                      src={`${teacher.userId.profileImage}`} 
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
        <div className="col-sm-7 col-md-9 chat-window h-100">
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
                  <div 
                    key={index} 
                    className={`message ${msg.sender._id === userInfo._id ? 'sent' : 'received'}`}
                    onClick={() => handleSelectMessage(msg)} 
                  >
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
                <button onClick={() => setShowEmojiPicker((prev) => !prev)} className="btn btn-light ms-2">
                  😊
                </button>
                <button onClick={isRecording ? handleStopRecording : handleStartRecording} className="btn btn-primary ms-2">
                  {isRecording ? 'Stop Recording' : 'Record Audio'}
                </button>
                <button onClick={handleSendAudioMessage} className="btn btn-success ms-2">
                  Send Audio
                </button>
                <button className="btn btn-primary ms-2" onClick={handleSendMessage}>Send</button>

              </div>
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}

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
