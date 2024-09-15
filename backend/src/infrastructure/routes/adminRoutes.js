// routes/adminRoutes.js
import express from 'express';
import {
  getTeachers,
  getStudents,
  handleToggleBlockTeacher,
  handleToggleBlockStudent,
} from '../../controllers/AdminController.js';

const router = express.Router();

router.get('/teachers', getTeachers);
router.get('/students', getStudents);
router.put('/teachers/:teacherId/toggle-block', handleToggleBlockTeacher);
router.put('/students/:studentId/toggle-block', handleToggleBlockStudent);

export default router;
