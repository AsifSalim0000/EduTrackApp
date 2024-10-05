
import {
  countInstructors,
  countStudents,
  findPaginatedUsers,
  toggleBlockStatus,
  } from '../repositories/UserRepository.js';
  import {
    findInstructorByUserId,
    findPaginatedInstructors,
    findUserById,
    updateUserRole,
  } from '../repositories/InstructorRepository.js';
import { countAllCourses } from '../repositories/CourseRepository.js';
  
  const getDashboardCount = async () => {
    try {
        const studentCount = await countStudents();
        const instructorCount = await countInstructors();
        const totalCourses = await countAllCourses();

        return {
            totalStudents: studentCount,
            totalInstructors: instructorCount,
            totalCourses: totalCourses,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

 const fetchTeachers = async ({ page, limit }) => {
    return findPaginatedInstructors({ role: { $in: ['Instructor', 'RequestForInstructor'] } }, page, limit);
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

  const acceptInstructorRequest = async (teacherId) => {
    try {
        const user = await findUserById(teacherId);
        if (!user) {
            return null;  // Handle user not found
        }
        if (user.role !== 'RequestForInstructor') {
            throw new Error('User has not requested instructor status');
        }

        user.role = 'Instructor';
        const updatedUser = await updateUserRole(user);
        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const rejectInstructorRequest = async (teacherId) => {
    try {
        const user = await findUserById(teacherId);
        if (!user) {
            return null;  // Handle user not found
        }
        if (user.role !== 'RequestForInstructor') {
            throw new Error('User has not requested instructor status');
        }

        user.role = 'Student';
        const updatedUser = await updateUserRole(user);
        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};
   export {getDashboardCount,fetchStudents,fetchTeachers,toggleBlockStudent,toggleBlockTeacher,acceptInstructorRequest,rejectInstructorRequest}