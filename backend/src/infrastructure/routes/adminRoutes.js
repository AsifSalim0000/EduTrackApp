// routes/adminRoutes.js
import express from 'express';
import {
  getTeachers,
  getStudents,
  handleToggleBlockTeacher,
  handleToggleBlockStudent,
  rejectInstructor,
  acceptInstructor,
  getDashboardCounts,
} from '../../controllers/AdminController.js';
import {admin, protect} from '../../middlewares/authMiddleware.js'

const router = express.Router();

router.get('/teachers',admin, getTeachers);
router.get('/students' ,admin, getStudents);
router.put('/teachers/:teacherId/toggle-block',admin, handleToggleBlockTeacher);
router.put('/students/:studentId/toggle-block',admin, handleToggleBlockStudent);
router.put('/teachers/:teacherId/accept',admin, acceptInstructor);
router.put('/teachers/:teacherId/reject',admin, rejectInstructor);
router.get('/dashboard-info',admin,getDashboardCounts)

export default router;
