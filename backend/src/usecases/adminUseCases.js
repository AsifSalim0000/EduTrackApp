
import {
    findPaginatedUsers,
    toggleBlockStatus,
  } from '../repositories/UserRepository.js';
  import {
    findInstructorByUserId,
    findPaginatedInstructors,
  } from '../repositories/InstructorRepository.js';
  
 const fetchTeachers = async ({ page, limit }) => {
    return findPaginatedInstructors({}, page, limit);
  };
  
 const fetchStudents = async ({ page, limit }) => {
    return findPaginatedUsers({ role: 'Student' }, page, limit);
  };
  
 const toggleBlockTeacher = async (teacherId) => {
    const instructor = await findInstructorByUserId(teacherId);
    if (!instructor) throw new Error('Teacher not found');
    return toggleBlockStatus(instructor.userId);
  };
  
 const toggleBlockStudent = async (studentId) => {
    return toggleBlockStatus(studentId);
  };
   export {fetchStudents,fetchTeachers,toggleBlockStudent,toggleBlockTeacher}