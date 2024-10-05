import { getTotalCourses, getTotalStudents, getTotalEarnings, getRecentActivities } from '../repositories/InstructorDashboardRepo.js';


export const getDashboardInfo = async (instructorId) => {
  const [totalCourses, totalStudents, totalEarnings, recentActivities] = await Promise.all([
    getTotalCourses(instructorId),
    getTotalStudents(instructorId),
    getTotalEarnings(instructorId),
    getRecentActivities(instructorId),
  ]);

  return {
    totalCourses,
    totalStudents,
    totalEarnings,
    newMessages: 0, 
    recentActivities
  };
};
