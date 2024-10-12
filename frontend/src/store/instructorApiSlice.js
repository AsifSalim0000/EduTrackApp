import { apiSlice } from './apiSlice';

const INSTRUCTOR_URL = '/instructor';

export const instructorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createInstructor: builder.mutation({
      query: (instructorData) => ({
        url: `${INSTRUCTOR_URL}/create-instructor`,
        method: 'POST',
        body: instructorData,
      }),
    }),
    fetchCourses: builder.query({
      query: ({ page, search }) => ({
        url: `${INSTRUCTOR_URL}/courses`,
        params: { page, search },
      }),
    }),
    createCourse: builder.mutation({
      query: (courseData) => {
        const formData = new FormData();
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        formData.append('thumbnail', courseData.thumbnail);
        

        return {
          url: `${INSTRUCTOR_URL}/create-course`,
          method: 'POST',
          body: formData,
        };
      },
    }),
    fetchCourseDetails: builder.query({
      query: (courseId) => `/instructor/course/${courseId}`, 
    }),
    saveCourseDetails: builder.mutation({
      query: (courseData) => ({
        url: `${INSTRUCTOR_URL}/save-course-details`,
        method: 'PUT',
        body: courseData,
      }),
    }),
    saveChapters: builder.mutation({
      query: (curriculum) => ({
        url: `${INSTRUCTOR_URL}/courses/chapters`,
        method: 'POST',
        body: curriculum,
      }),
    }),
    uploadVideo: builder.mutation({
      query: (formData) => ({
        url: `${INSTRUCTOR_URL}/upload-video`,
        method: 'POST',
        body: formData,
      }),
    }),
    fetchStudents: builder.query({
      query: () => `${INSTRUCTOR_URL}/messages/students`,
    }),
    getDashboardInfo: builder.query({
      query: () => ({
        url: `${INSTRUCTOR_URL}/dashboard-info`, 
        method: 'GET',
      }),
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${INSTRUCTOR_URL}/courses/${courseId}`,
        method: 'PATCH', 
        body: { isDeleted: true },
      }),
      invalidatesTags: ['Courses'], // Invalidate cached courses
    }),
    toggleLiveCourse: builder.mutation({
      query: ({ courseId, isLive }) => ({
        url: `${INSTRUCTOR_URL}/courses/${courseId}/live`,
        method: 'PATCH',
        body: { isLive },
      }),
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useCreateInstructorMutation,
  useFetchCoursesQuery,
  useCreateCourseMutation,
  useFetchCourseDetailsQuery,
  useSaveCourseDetailsMutation,
  useSaveChaptersMutation,
  useUploadVideoMutation, 
  useFetchStudentsQuery,
  useGetDashboardInfoQuery,
  useDeleteCourseMutation,
   useToggleLiveCourseMutation
} = instructorApiSlice;
