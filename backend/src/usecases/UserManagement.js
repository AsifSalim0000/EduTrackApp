import { findByEmail,findUserById } from '../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';
import User from '../domain/User.js'
import asyncHandler from 'express-async-handler';

const loginUser = async (email, password) => {
  const user = await findByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  } else {
    throw new Error('Invalid email or password');
  }
};
const getUserStatus = async (userId) => {
  try {
    const user = await findUserById(userId);
    
    if (!user) {
      return { status: 'not_found' };
    }
    
    return { status: user.status};
  } catch (error) {
    throw new Error('Error getting user status');
  }
};

const updateUser = async (userId, updateData) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return null;
        }

        user.username = updateData.username || user.username;
        user.title = updateData.title || user.title;
        user.profileImage = updateData.profileImage || user.profileImage;

        const updatedUser = await user.save();

        return {
            _id: updatedUser._id,
            username: updatedUser.username,
            title: updatedUser.title,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage
        };
    } catch (error) {
        throw error;
    }
};

// Update user password
const updatePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return false;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return true;
    } catch (error) {
        throw error;
    }
};


export default{
  loginUser,getUserStatus, updateUser,
  updatePassword
};
