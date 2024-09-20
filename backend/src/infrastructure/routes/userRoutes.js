import express from 'express';
import { logoutUser,loginUser,googleAuthHandler, resetPasswordHandler, UserStatus, fetchCourses, fetchCourseById, updateUser, updatePassword, getUserWishlist } from '../../controllers/UserController.js';
import { forgotOtp, sendOtp, verifyForgotOtpHandler, verifyOtpHandler } from '../../controllers/OtpController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { handleCreateInstructor } from '../../controllers/instructor/InstructorController.js';
import { addCourseToCart, addCourseToWishlist, fetchCart, removeFromCart } from '../../controllers/CartController.js';
import { createOrder, createRazorpayOrder,getOrderHistory } from '../../controllers/OrderController.js';
import { getCoursesByUser,getMyCourseById } from '../../controllers/MyCoursesController.js';
import upload from '../../middlewares/upload.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpHandler);
router.post('/login', loginUser);
router.post('/google-auth', googleAuthHandler);
router.post('/forgot-otp', forgotOtp);
router.post('/verify-forgototp', verifyForgotOtpHandler);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPasswordHandler);
router.post('/create-instructor',protect,  handleCreateInstructor);
router.get('/status',protect, UserStatus);
router.get('/courses',protect, fetchCourses);
router.get('/course-details/:courseId',protect, fetchCourseById);
router.post('/add-to-cart',protect, addCourseToCart);
router.post('/wishlist',protect, addCourseToWishlist);
router.get('/wishlist',protect, getUserWishlist);
router.get('/cart-details',protect, fetchCart);
router.post('/remove-from-cart',protect, removeFromCart);
router.post('/create-razorpay-order',protect,createRazorpayOrder)
router.post('/create-order',protect,createOrder)
router.get('/my-courses',protect,getCoursesByUser)
router.put('/update-user', protect,upload.single('profileImage'), updateUser);
router.put('/update-password', protect, updatePassword);
router.get('/mycourse/:courseId',protect,getMyCourseById)
router.get('/orders/history',protect,getOrderHistory)

export default router;
