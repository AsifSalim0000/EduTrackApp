import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderNavbar from './components/HeaderNavbar';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

const App = () => {
  const { userInfo } = useSelector((state) => state.auth); 

  useEffect(() => {
    if (userInfo) {
      
      socket.emit('joinChat', userInfo._id);


      socket.on('receiveMessage', (newMessage) => {
        const isUserInChat = newMessage.chat.users.includes(userInfo._id);

        if (isUserInChat) {

          
          toast.info(`New message from ${newMessage.sender.username}: ${newMessage.content}`);
        }
      });

      socket.on('messageDeleted', (messageId) => {
        toast.info(`Message with ID ${messageId} was deleted.`);
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('messageDeleted');
      };
    }
  }, [userInfo]); 

  return (
    <>
      <HeaderNavbar />
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default App;
