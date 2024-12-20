import express from 'express';
import { logoutUser,loginUser,googleAuthHandler, resetPasswordHandler, UserStatus, fetchCourses, fetchCourseById, updateUser, updatePassword, getUserWishlist } from '../../controllers/UserController.js';
import { forgotOtp, sendOtp, verifyForgotOtpHandler, verifyOtpHandler } from '../../controllers/OtpController.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { handleCreateInstructor } from '../../controllers/instructor/InstructorController.js';
import { addCourseToCart, addCourseToWishlist, fetchCart, removeCourseFromWishlist, removeFromCart } from '../../controllers/CartController.js';
import { createOrder, createRazorpayOrder,getOrderHistory } from '../../controllers/OrderController.js';
import { getCoursesByUser,getMyCourseById, searchCourses, searchFilterCourses } from '../../controllers/MyCoursesController.js';
import upload from '../../middlewares/upload.js';
import { deleteMessageController, fetchMyTeachers, getMessages, sendAudio, sendMessage } from '../../controllers/MessageController.js';
import { addReview, getUserReviewForCourse } from '../../controllers/ReviewController.js';
import { refreshAccessToken } from '../../middlewares/AuthController.js';
import { handleGetUserCourseProgress, markAsComplete } from '../../controllers/CourseProgressController.js';
import audioUpload from '../../middlewares/audioUpload.js';
import { getSignedUrlHandler } from '../../controllers/VideoController.js';

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
router.get('/course-progress',protect, handleGetUserCourseProgress);
router.put('/update-user', protect,upload.single('profileImage'), updateUser);
router.put('/update-password', protect, updatePassword);
router.get('/mycourse/:courseId',protect,getMyCourseById)
router.get('/orders/history',protect,getOrderHistory)
router.get('/messages/teachers',protect,fetchMyTeachers)
router.post('/chat/message',protect,sendMessage)
router.get('/chat/:chatId/live-updates',protect,getMessages)
router.delete('/wishlist/:courseId',protect,removeCourseFromWishlist)
router.post('/reviews',protect,addReview);
router.get('/reviews/user/:courseId', protect,getUserReviewForCourse);
router.post('/refresh-token',refreshAccessToken);
router.delete('/messages/:messageId',protect, deleteMessageController);
router.post('/mark-as-complete',protect, markAsComplete);
router.post('/upload-audio', audioUpload.single('audio'),sendAudio);
router.post('/courses/search', protect,searchCourses);
router.post('/courses/search-filter', protect,searchFilterCourses);
router.get('/video/videos/:key', getSignedUrlHandler);

export default router;
