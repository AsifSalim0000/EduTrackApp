import {
    fetchTeachers,
    fetchStudents,
    toggleBlockTeacher,
    toggleBlockStudent,
  } from '../usecases/adminUseCases.js';
  
const getTeachers = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const teachers = await fetchTeachers({ page, limit });
      res.json({ teachers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
const getStudents = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const students = await fetchStudents({ page, limit });
      res.json({ students });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
const handleToggleBlockTeacher = async (req, res) => {
    try {
      const { teacherId } = req.params;
      const teacher = await toggleBlockTeacher(teacherId);
      res.json({ message: 'Teacher block status updated', teacher });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
const handleToggleBlockStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await toggleBlockStudent(studentId);
      res.json({ message: 'Student block status updated', student });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  export {handleToggleBlockStudent,handleToggleBlockTeacher,getStudents,getTeachers}