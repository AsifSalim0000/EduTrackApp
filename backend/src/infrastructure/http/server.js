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

import { notFound,errorHandler } from '../../middlewares/errorMiddleware.js';
import Course from '../../domain/Course.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
connectDB();

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

app.get('/api/mycourses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('contents.contentId');
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching course data' });
  }
});

// Routes
app.use('/api/user', routes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/admin', adminRoutes);
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
  
  app.use(notFound);
  app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
