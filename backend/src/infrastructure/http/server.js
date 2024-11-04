import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from '../db/mongoose.js';
import routes from '../routes/userRoutes.js';
import instructorRoutes from '../routes/instructorRoutes.js';
import adminRoutes from '../routes/adminRoutes.js';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import nocache from 'nocache';
import http from 'http';
import { Server } from 'socket.io';
import { notFound, errorHandler } from '../../middlewares/errorMiddleware.js';

dotenv.config();

// Set up the current file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Express app
const app = express();
connectDB(); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinChat', ({ userId, chatId }) => {
    onlineUsers[userId] = { socketId: socket.id, chatId };
    socket.join(chatId);
    io.emit('onlineUsers', onlineUsers);
  });

  socket.on('sendMessage', (messageData) => {
    io.to(messageData.chatId).emit('receiveMessage', messageData);
  });

  // Handle typing events
  socket.on('typing', ({ senderId, receiverId }) => {
    io.to(onlineUsers[receiverId]?.socketId).emit('typing', { senderId, receiverId });
  });

  socket.on('stopTyping', ({ senderId, receiverId }) => {
    io.to(onlineUsers[receiverId]?.socketId).emit('stopTyping', { senderId, receiverId });
  });
  socket.on('deleteMessage', (messageId) => {
    io.emit('messageDeleted', messageId); 
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    io.emit('onlineUsers', onlineUsers);
  });
});

app.use(express.json());
app.use(bodyParser.json());
app.use(nocache());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || uuidv4(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
}));

app.use('/api/user', routes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
