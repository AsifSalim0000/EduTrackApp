
import express from 'express';
import { getInstructorDashboardInfo, handleCreateInstructor } from '../../controllers/instructor/InstructorController.js';
import { protect } from '../../middlewares/authMiddleware.js'
import { createCourseController, fetchCourse, getCoursesController, saveCourseDetails, uploadVideo } from '../../controllers/instructor/CourseController.js';
import upload from '../../middlewares/upload.js';
import videoUpload from '../../middlewares/videoUpload.js';
import { getStudentsByInstructor } from '../../controllers/MessageController.js';

const router = express.Router();

router.post('/create-instructor',protect,  handleCreateInstructor);
router.get('/courses',protect, getCoursesController);
router.post('/create-course', protect, upload.single('thumbnail'), createCourseController);
router.get('/course/:id',protect, fetchCourse);
router.put('/save-course-details',protect, upload.single('thumbnail'), saveCourseDetails);
router.post('/upload-video', videoUpload.single('video'), uploadVideo);
router.get('/messages/students',protect,getStudentsByInstructor)
router.get('/dashboard-info',protect,getInstructorDashboardInfo)

export default router;
