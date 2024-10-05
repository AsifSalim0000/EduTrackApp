import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import HomePage from './pages/HomePage';
import RegisterForm from './pages/RegisterForm';
import OtpPage from './pages/OtpPage';
import LoginForm from './pages/LoginForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgotPasswordEmailForm from './pages/ForgotPasswordEmailForm';
import ForgotPasswordOtp from './pages/ForgotPasswordOtp';
import ResetPassword from './pages/ResetPassword';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import AuthGuard from './components/AuthGuard'; 
import InstructorLayout from './components/instructor/InstructorLayout';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import BecomeTeacherForm from './pages/instructor/BecomeTeacherForm';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminStudents from './pages/admin/AdminStudents';
import CoursesPage from './pages/instructor/CoursePage';
import CreateCourseForm from './pages/instructor/CreateCourseForm';
import CourseContentPage from './pages/instructor/CourseContentPage';
import CourseDetail from './pages/user/CourseDetail';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import UserDashboardLayout from './components/user/UserDashboardLayout';
import UserDashboard from './pages/user/UserDashboard';
import CoursesList from './pages/user/CoursesList';
import AccountSettings from './pages/user/AccountSettings';
import MyCourseContent from './pages/user/MyCourseContent';
import OrderHistory from './pages/user/OrderHistory';
import Wishlist from './pages/user/Wishlist';
import ChatApp from './pages/user/ChatApp';
import InstructorChatApp from './pages/instructor/InstructorChatApp';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>  
        <Route path="register" element={<RegisterForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="verify-otp" element={<OtpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordEmailForm />} />
        <Route path="forgotpassword-otp" element={<ForgotPasswordOtp />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/" element={<App />}>     
      <Route element={<AuthGuard />}>
        <Route index element={<HomePage />} />
        <Route path="become-a-tutor" element={<BecomeTeacherForm />} />
        <Route path="coursedetails/:courseId" element={<CourseDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="my-course/:courseId" element={<MyCourseContent />} />
      </Route>

      </Route>

      <Route path="/" element={<App />}>
      <Route element={<AuthGuard />}>
      <Route path="/profile" element={<UserDashboardLayout />}>
           <Route path="dashboard" element={<UserDashboard />} />
           <Route path="courses" element={<CoursesList />} />
           <Route path="settings" element={<AccountSettings />} />
           <Route path="purchase-history" element={<OrderHistory />} />
           <Route path="wishlist" element={<Wishlist />} />
           <Route path="messages" element={<ChatApp />} />
      </Route>
      </Route>
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<ProtectedRoute allowedRole="Instructor" />}>
          <Route path="/instructor" element={<InstructorLayout activeItem="dashboard" />}>
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/create-course" element={<CreateCourseForm />} />
            <Route path="courses/:courseId/add-content" element={<CourseContentPage />} />
            <Route path="messages" element={<InstructorChatApp />} />
          </Route>
        </Route>
      </Route>

    
      <Route path="/admin/*" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="instructors" element={<AdminTeachers />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="665572429672-6qkq3k127fei6lg22d65k5dgd8cjduh1.apps.googleusercontent.com">
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </GoogleOAuthProvider>
  </Provider>
);
