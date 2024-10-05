import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import UserManagement from '../usecases/UserManagement.js';
import generateTokens from '../utils/generateTokens.js';
import { verifyGoogleToken } from '../usecases/VerifyGoogleToken.js';
import { findByEmail, createUser, resetPassword } from '../repositories/UserRepository.js';
import courseUsecase from '../usecases/courseUsecase.js';
import { fetchWishlistForUser } from '../usecases/cartUseCases.js';
import { HttpStatus } from '../utils/HttpStatus.js'; 

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserManagement.loginUser(email, password);
  if (user) {
    generateTokens(res, user._id);
    res.status(HttpStatus.OK).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      title: user.title,
      profileImage: user.profileImage,
    });
  } else {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid email or password' });
  }
});

const googleAuthHandler = asyncHandler(async (req, res) => {
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
  generateTokens(res, user._id);

  res.status(HttpStatus.OK).json({
    email: user.email,
    _id: user._id,
    username: user.username,
    role: user.role,
    isAdmin: user.isAdmin,
    title: user.title,
    profileImage: user.profileImage,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
});

const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const email = req.session.email;
  const user = await resetPassword(email, newPassword);
  if (user) {
    res.status(HttpStatus.OK).json({ message: 'Password reset successfully' });
  } else {
    res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
  }
});

const UserStatus = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const status = await UserManagement.getUserStatus(userId);

    if (status.status === 'not_found') {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    }

    return res.status(HttpStatus.OK).json(status);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

const fetchCourses = asyncHandler(async (req, res) => {
  const { page = 1, search = '' } = req.query;
  const userId = req.user.id;
  try {
    const courses = await courseUsecase.fetchAllCourses(userId, page, search);
    res.status(HttpStatus.OK).json(courses);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching courses' });
  }
});

const fetchCourseById = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await courseUsecase.fetchCourseDetails(courseId);

    res.status(HttpStatus.OK).json(course);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, title } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const updateData = { username, title };

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const updatedUser = await UserManagement.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
    }

    return res.status(HttpStatus.OK).json({
      email: updatedUser.email,
      _id: updatedUser._id,
      username: updatedUser.username,
      title: updatedUser.title,
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Passwords do not match' });
    }

    const isUpdated = await UserManagement.updatePassword(userId, currentPassword, newPassword);

    if (!isUpdated) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Current password is incorrect' });
    }

    return res.status(HttpStatus.OK).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
});

const getUserWishlist = asyncHandler(async (req, res) => {
  try {
    const wishlist = await fetchWishlistForUser(req.user.id);
    res.status(HttpStatus.OK).json(wishlist);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch wishlist' });
  }
});

export {
  logoutUser,
  loginUser,
  googleAuthHandler,
  resetPasswordHandler,
  UserStatus,
  fetchCourses,
  fetchCourseById,
  updateUser,
  updatePassword,
  getUserWishlist,
};
