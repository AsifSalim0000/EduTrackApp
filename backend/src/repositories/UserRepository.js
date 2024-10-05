import bcrypt from 'bcryptjs';
import User from '../domain/User.js';
import asyncHandler from 'express-async-handler';

const createUser = asyncHandler(async ({ email, username, password }) => {
  const salt = await bcrypt.genSalt(10);  
  const hashedPassword = await bcrypt.hash(password, salt); 
  const newUser = new User({ email, username, password: hashedPassword });

  await newUser.save();

  return newUser;
});

const findByEmail = asyncHandler(async (email) => {
  return await User.findOne({ email });
});

const resetPassword = asyncHandler(async (email, newPassword) => {
  if (!email || !newPassword) {
    throw new Error('Email and new password are required.');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  const user = await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );

  return user;
});

const findUserById = async (userId) => {
  const user=  await User.findById(userId)
  
  return user;
};

const findPaginatedUsers = async (query, page, limit) => {
  console.log(query);
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
  return users;
};


const toggleBlockStatus = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
  }
  return user;
};
const countStudents = async () => {
  return await User.countDocuments({ role: 'Student' });
};

const countInstructors = async () => {
  return await User.countDocuments({
      role: { $in: ['Instructor', 'RequestForInstructor'] },
  });
};

export { findByEmail, createUser, resetPassword,findUserById,findPaginatedUsers,toggleBlockStatus,countInstructors,countStudents };
