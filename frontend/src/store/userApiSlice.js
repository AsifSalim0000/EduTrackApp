import { apiSlice } from './apiSlice';

const USERS_URL = '/user';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (formData) => ({
        url: `${USERS_URL}/send-otp`,
        method: 'POST',
        body: formData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otp) => ({
        url: `${USERS_URL}/verify-otp`,
        method: 'POST',
        body: { otp },
      }),
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    googleAuth: builder.mutation({
      query: (token) => ({
        url: `${USERS_URL}/google-auth`,
        method: 'POST',
        body: { token },
      }),
    }),
    forgotOtp: builder.mutation({
      query: (email) => ({
        url: `${USERS_URL}/forgot-otp`,
        method: 'POST',
        body: email,
      }),
    }),
    resendOtp: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/resend-otp`,
        method: 'POST',
      }),
    }),
    resetPassword: builder.mutation({
      query: (newPassword) => ({
        url: `${USERS_URL}/reset-password`,
        method: 'POST',
        body: { newPassword },
      }),
    }),
    verifyForgotOtp: builder.mutation({
      query: (otp) => ({
        url: `${USERS_URL}/verify-forgototp`,
        method: 'POST',
        body: { otp },
      }),
    }),
    getUserStatus: builder.query({
      query: () => `${USERS_URL}/status`,
    }),

    getCourses: builder.query({
      query: () => `${USERS_URL}/courses`,
    }),

    getCourseById: builder.query({
      query: (id) => `${USERS_URL}/course-details/${id}`,
    }),
    getCart: builder.query({
      query: (id) => `${USERS_URL}/cart-details`,
    }),
    addToCart: builder.mutation({
      query: (courseId) => ({
        url: `${USERS_URL}/add-to-cart`,
        method: 'POST',
        body: { courseId },
      }),
    }),

    addToWishlist: builder.mutation({
      query: (courseId) => ({
        url: `${USERS_URL}/wishlist`,
        method: 'POST',
        body: { courseId },
      }),
    }),
    removeFromCart: builder.mutation({
      query: (courseId) => ({
        url: `${USERS_URL}/remove-from-cart`,
        method: 'POST',
        body: { courseId },
      }),
    }),
    createRazorpayOrder: builder.mutation({
      query: (amount) => ({
        url: `${USERS_URL}/create-razorpay-order`,
        method: 'POST',
        body: { amount },
      }),
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `${USERS_URL}/create-order`,
        method: 'POST',
        body: orderData,
      }),
    }),
    getMyCourses: builder.query({
      query: ({ page = 1, limit = 6, search = '' }) => 
        `${USERS_URL}/my-courses?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/update-user`,
        method: 'PUT',
        body: userData,
      }),
    }),
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: `${USERS_URL}/update-password`,
        method: 'PUT',
        body: passwordData,
      }),
    }),
    
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGoogleAuthMutation,
  useForgotOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useVerifyForgotOtpMutation,
  useGetUserStatusQuery,
  useGetCoursesQuery, 
  useGetCourseByIdQuery, 
  useGetCartQuery,
  useAddToCartMutation, 
  useAddToWishlistMutation,
  useRemoveFromCartMutation,
  useCreateRazorpayOrderMutation,
  useCreateOrderMutation,
  useGetMyCoursesQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation
} = userApiSlice;

