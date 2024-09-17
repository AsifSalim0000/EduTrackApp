import MyCourses from '../domain/MyCourses.js';

 const findMyCoursesByUserId = async (userId) => {
  return await MyCourses.findOne({ userId });
};

 const saveMyCourses = async (myCourses) => {
  return await myCourses.save();
};
const findUserEnrolledCourse = async (userId, courseId) => {
  return await MyCourses.findOne({
      userId: userId,
      'courses.courseId': courseId
  });
};
export {findMyCoursesByUserId,saveMyCourses,findUserEnrolledCourse}