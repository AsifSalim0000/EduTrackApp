import Course from '../domain/Course.js';
import Order from '../domain/Order.js';
import mongoose from 'mongoose';

export const getTotalCourses = async (instructorId) => {
  return await Course.countDocuments({ instructor: instructorId });
};

export const getTotalStudents = async (instructorId) => {
  const orders = await Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'courses',
        localField: 'items.courseId',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    { $match: { 'course.instructor': new mongoose.Types.ObjectId(instructorId) } }, 
    { $group: { _id: '$userId' } }, // Group by userId to avoid duplication
    { $count: 'totalStudents' }
  ]);
  return orders.length > 0 ? orders[0].totalStudents : 0;
};

// Get total earnings of the instructor
export const getTotalEarnings = async (instructorId) => {
  const earnings = await Order.aggregate([
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'courses',
        localField: 'items.courseId',
        foreignField: '_id',
        as: 'course'
      }
    },
    { $unwind: '$course' },
    { $match: { 'course.instructor': new mongoose.Types.ObjectId(instructorId) } }, // <-- Use 'new' here
    { $group: { _id: null, totalEarnings: { $sum: '$items.price' } } }
  ]);
  return earnings.length > 0 ? earnings[0].totalEarnings : 0;
};


// Get recent activities for the instructor
export const getRecentActivities = async (instructorId) => {
  
  return [
    'New student enrolled in React Basics - 1 hour ago',
    'Course received a new review - 2 hours ago',
  ];
};
