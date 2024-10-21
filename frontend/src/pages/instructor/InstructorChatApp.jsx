import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InstructorChat.css';
import { useSelector } from 'react-redux';
import { useFetchStudentsQuery } from '../../store/instructorApiSlice';
import { useSendMessageMutation, useGetLiveUpdatesQuery, useDeleteMessageMutation,useSendAudioMutation } from '../../store/userApiSlice';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import { BsFillMicFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { AiOutlineClose } from 'react-icons/ai';

const socket = io('http://localhost:5000');

function InstructorChatApp() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: students, isFetching: fetchingStudents, isError } = useFetchStudentsQuery();
  const [sendMessage] = useSendMessageMutation();
  const [sendAudio] = useSendAudioMutation(); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingStatuses, setTypingStatuses] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); 
  const chatBodyRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [deleteMessage] = useDeleteMessageMutation();

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
      socket.emit('stopTyping', selectedStudent._id); 
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    if (selectedStudent) {
      socket.emit('typing', {
        senderId: userInfo._id,
        receiverId: selectedStudent._id, 
        chatId: selectedStudent._id, 
      });
    }

    clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => {
      if (selectedStudent) {
        socket.emit('stopTyping', {
          senderId: userInfo._id,
          receiverId: selectedStudent._id, 
        });
      }
    }, 1000));
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
          setAudioBlob(audioBlob);
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

const handleSendAudioMessage = async () => {
  if (audioBlob && selectedStudent) {
    if (!(audioBlob instanceof Blob)) {
      console.error('Audio blob is not valid:', audioBlob);
      return;
    }
    console.log("form data",audioBlob);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audioMessage.wav');
    console.log("form data",formData);
    

    try {
    
      const result = await sendAudio(formData).unwrap();
      

      const messageData = {
        sender: userInfo._id,
        content: result.fileUrl, 
        chatId: selectedStudent._id,
        receiverId: selectedStudent.userId._id,
        type: 'audio', 
      };

      const { data } = await sendMessage(messageData);
      socket.emit('sendMessage', data); 
      setMessages((prevMessages) => [...prevMessages, data]); 
      setAudioBlob(null); 
    } catch (error) {
      console.error('Failed to send audio message:', error);
    }
  } else {
    console.error('No audio to send or teacher not selected.');
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
      socket.emit('deleteMessage',  messageId);
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
  const [replyMessage, setReplyMessage] = useState(null);

  const handleReplyMessage = (msg) => {
    setReplyMessage(msg); 
  };
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown((prevState) => (prevState === index ? null : index));
  };
  useEffect(() => {
    socket.on('messageDeleted', (deletedMessageId) => {
      setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== deletedMessageId));
    });
  }, []);
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
    if (selectedStudent) {
      socket.emit('joinChat', selectedStudent._id);

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
      if (selectedStudent) {
        socket.off('typing');
        socket.off('stopTyping');
      }
    };
  }, [selectedStudent]);

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
    <div className="container container-fluid py-4 instructor-chat-sidebar">
      <div className="row">
        <div className="col-sm-3 p-0">
          <div className="sidebar-header p-3">
            <input className="form-control" type="text" placeholder="Search" />
          </div>
          <div className="list-group">
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
                      src={`${student.profileImage}`} 
                      alt=""
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }} 
                    />
                  </div>
                  <div className="user-info overflow-hidden">
                    <h6>{student.username}</h6>
                    <p>{onlineUsers[student._id] ? 'Online' : 'Offline'}</p>
                    {typingStatuses[student._id] && (
                      <p className="text-dark">
                        Typing<span className="dott">.</span><span className="dott">.</span><span className="dott">.</span>
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="col-sm-9 instructor-chat-window">
          {selectedStudent ? (
            <>
              <div className="chat-header p-3">
                <h5>{selectedStudent.username}</h5>
                <p>{onlineUsers[selectedStudent._id] ? 'Online' : 'Offline'}</p>
                {typingStatuses[selectedStudent._id] && (
                  <p className="text-dark instructor-typing-indicator">
                    Typing<span className="dott">.</span><span className="dott">.</span><span className="dott">.</span>
                  </p>
                )}
              </div>
              <div className="chat-body" ref={chatBodyRef} style={{ overflowY: 'auto', minHeight: '70vh', maxHeight: '70vh' }}>
                {messages.map((msg, index) => (
                  <div 
                  key={index} 
                  className={`row message ${msg.sender._id === userInfo._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content col-11">
                  {msg.replyTo && (
                          <div className="replied-message bg-white rounded px-3 py-1">
                            <p className="replied-message-content text-black">{msg.replyTo.sender._id === userInfo._id ? 'You' : msg.replyTo.sender.username} : {msg.replyTo.content}</p>
                          </div>
                    )}
                    {msg.type === 'text' && (
                      <p>{msg.content}</p>
                    )}
                    {msg.type === 'audio' && (
                      <div className="audio-message">
                        <audio controls className='w-100'>
                          <source src={msg.content} type="audio/wav" />
                          Your browser does not support the audio tag.
                        </audio>
                      </div>
                    )}
                  </div>
                
                  <div className="message-options col-1">
                    <button className="ellipsis-btn" onClick={() => toggleDropdown(index)}>
                      &#x22EE;
                    </button>
                    {openDropdown === index && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleReplyMessage(msg)}>Reply</button>
                        <button onClick={() => handleSelectMessage(msg)}>Delete</button>
                      </div>
                    )}
                  </div>

                  <span className="message-timestamp">{formatTime(msg.createdAt)}</span>
                </div>
                ))}
              </div>
              <div className="chat-footer p-3 d-flex row">
              {replyMessage && (
                     <div className="reply-box mb-2 p-2 border rounded bg-light col-12">
                     <div className="d-flex justify-content-between align-items-center">
                       <p className="mb-0">Replying to: {replyMessage.content}</p>
                       <button className="btn btn-sm bg-danger text-white" onClick={() => setReplyMessage(null)}>
                         <AiOutlineClose></AiOutlineClose>
                       </button>
                     </div>
                   </div>
            
                 )}
                 <div className="d-flex col-12">
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
              </div>
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}

            </>
          ) : (
            <div className="no-chat">
              <p>Select a student to start chatting!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorChatApp;
