import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import UserManagement from '../usecases/UserManagement.js';
import generateToken from '../utils/generateToken.js';
import { verifyGoogleToken } from '../usecases/VerifyGoogleToken.js';
import { findByEmail, createUser, resetPassword } from '../repositories/UserRepository.js';
import courseUsecase from '../usecases/courseUsecase.js';

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserManagement.loginUser(email, password);
  if (user) {
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      title: user.title,
      profileImage: user.profileImage
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

const googleAuthHandler = async (req, res) => {
  const { token } = req.body;
  const googleUser = await verifyGoogleToken(token);
  let user = await findByEmail(googleUser.email);
  if (!user) {
    user = await createUser({
      email: googleUser.email,
      username: googleUser.name,
      password: '123456',
    });
  }
  generateToken(res, user._id);
  
  res.json({
      email: user.email,
      _id: user._id,
      username: user.username,
      role: user.role,
      isAdmin: user.isAdmin,
      title: user.title,
      profileImage: user.profileImage
  });
};

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const email = req.session.email;
  const user = await resetPassword(email, newPassword);
  if (user) {
    res.status(200).json({ message: 'Password reset successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
const UserStatus = asyncHandler(async (req, res) => {
  try {
  
    const userId = req.user._id; 

    const status = await UserManagement.getUserStatus(userId);
    
    if (status.status === 'not_found') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(status);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
const fetchCourses=async(req,res)=>{
  const { page = 1, search = '' } = req.query;
  try {
    const courses = await courseUsecase.fetchAllCourses(page, search);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
}
const fetchCourseById=async(req,res)=>{
  try {
    const courseId = req.params.courseId;
    const course = await courseUsecase.fetchCourseDetails(courseId);

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const updateUser = async (req, res) => {
  try {
      const userId = req.user._id;
      const { username, title } = req.body;
      
      const profileImage = req.file ? req.file.filename : null;

      const updateData = {
          username,
          title,
      };

      if (profileImage) {
          updateData.profileImage = profileImage;
      }

      const updatedUser = await UserManagement.updateUser(userId, updateData);
      
      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({
        email: updatedUser.email,
        _id: updatedUser._id,
        username: updatedUser.username,
        title: updatedUser.title,
        profileImage: updatedUser.profileImage
      });
  } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};

const updatePassword = async (req, res) => {
  try {
      const userId = req.user._id; 
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      const isUpdated = await UserManagement.updatePassword(userId, currentPassword, newPassword);

      if (!isUpdated) {
          return res.status(400).json({ message: 'Current password is incorrect' });
      }

      return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};
export { logoutUser, loginUser, googleAuthHandler, resetPasswordHandler ,UserStatus,fetchCourses,fetchCourseById,updateUser,updatePassword};
