import jwt from 'jsonwebtoken';
import User from '../domain/User.js'; // Assuming you have the User model here
import Instructor from '../domain/Instructor.js';
import asyncHandler from 'express-async-handler';

const useIdFromToken = asyncHandler(async (token) => {
  try {
    console.log('Token received:', token); 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log('Decoded JWT:', decoded);
    const userId = decoded.userId;
    return userId;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    throw new Error('Invalid or expired token');
  }
});

const findUserById = asyncHandler(async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
});

const createInstructor = asyncHandler(async (instructorData, token) => {
  try {
    const userId = await useIdFromToken(token);

    const user = await findUserById(userId);
    if (user.role === "Instructor") {
      const existingInstructor = await Instructor.findOne({ userId });
      if (existingInstructor) {
        throw new Error('Instructor profile already exists');
      }
    } else {
      
      user.role = "RequestForInstructor";
      await user.save();
    }

    const instructor = new Instructor({
      userId,
      ...instructorData,
    });

    return await instructor.save();
  } catch (error) {
    throw new Error(error.message);
  }
});
const findInstructorByUserId = async (userId) => {
  return await Instructor.findById(userId);
};

const findPaginatedInstructors = async (query, page, limit) => {
  return Instructor.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId');
};

export { createInstructor, useIdFromToken, findUserById,findPaginatedInstructors,findInstructorByUserId };
