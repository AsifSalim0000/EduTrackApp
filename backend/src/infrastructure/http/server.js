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
import http from 'http';  // Import the http module
import { Server } from 'socket.io';  // Import socket.io server

import { notFound, errorHandler } from '../../middlewares/errorMiddleware.js';

// Necessary for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the app and server
const app = express();
dotenv.config();
connectDB();

// Create the server using http, which will work with socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Define allowed origins
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(nocache());
app.use(cookieParser());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || uuidv4(), 
    resave: false,
    saveUninitialized: false, 
    cookie: {
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
}));

// Routes
app.use('/api/user', routes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);

// Handle production mode for serving the frontend
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

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle receiving messages
  socket.on('sendMessage', (messageData) => {
    // Broadcast the message to all connected users
    io.emit('receiveMessage', messageData);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
