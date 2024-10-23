import {
  fetchTeachers,
  fetchStudents,
  toggleBlockTeacher,
  toggleBlockStudent,
  getDashboardCount,
  acceptInstructorRequest,
  rejectInstructorRequest
} from '../usecases/adminUseCases.js';

import { HttpStatus } from '../utils/HttpStatus.js'; 

const getDashboardCounts = async (req, res) => {
  try {
    
      const counts = await getDashboardCount();
      
      return res.status(200).json(counts);
  } catch (error) {
      console.error("Error in fetching dashboard counts:", error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

const getTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const teachers = await fetchTeachers({ page, limit });
    res.status(HttpStatus.OK).json({ teachers });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getStudents = async (req, res) => {

  try {
    
    const { page = 1, limit = 10 } = req.query;
    const students = await fetchStudents({ page, limit });
    
    res.status(HttpStatus.OK).json({ students });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const handleToggleBlockTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await toggleBlockTeacher(teacherId);
    res.status(HttpStatus.OK).json({ message: 'Teacher block status updated', teacher });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const handleToggleBlockStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await toggleBlockStudent(studentId);
    res.status(HttpStatus.OK).json({ message: 'Student block status updated', student });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const acceptInstructor = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const updatedUser = await acceptInstructorRequest(teacherId);
    res.status(HttpStatus.OK).json({ message: 'Instructor request accepted', updatedUser });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const rejectInstructor = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const updatedUser = await rejectInstructorRequest(teacherId);
    res.status(HttpStatus.OK).json({ message: 'Instructor request rejected', updatedUser });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export {
  getDashboardCounts,
  handleToggleBlockStudent,
  handleToggleBlockTeacher,
  getStudents,
  getTeachers,
  acceptInstructor,
  rejectInstructor,
};
