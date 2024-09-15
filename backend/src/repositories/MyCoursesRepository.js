import MyCourses from '../domain/MyCourses.js';

 const findMyCoursesByUserId = async (userId) => {
  return await MyCourses.findOne({ userId });
};

 const saveMyCourses = async (myCourses) => {
  return await myCourses.save();
};

export {findMyCoursesByUserId,saveMyCourses}