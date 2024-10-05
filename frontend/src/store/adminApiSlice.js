import { apiSlice } from './apiSlice';

const ADMIN_URL = '/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
    fetchAllTeachers: builder.query({
      query: ({ page, limit }) => `${ADMIN_URL}/teachers?page=${page}&limit=${limit}`,
      providesTags: ['Teacher'],
    }),

    
    fetchAllStudents: builder.query({
      query: ({ page, limit }) => `${ADMIN_URL}/students?page=${page}&limit=${limit}`,
    }),

    
    toggleBlockTeacher: builder.mutation({
      query: (teacherId) => ({
        url: `${ADMIN_URL}/teachers/${teacherId}/toggle-block`,
        method: 'PUT',
      }),
      invalidatesTags: ['Teacher'],
    }),
 
    toggleBlockStudent: builder.mutation({
      query: (studentId) => ({
        url: `${ADMIN_URL}/students/${studentId}/toggle-block`,
        method: 'PUT',
      }),
      invalidatesTags: ['Student'],
    }),
    acceptInstructorRequest: builder.mutation({
      query: (teacherId) => ({
        url: `${ADMIN_URL}/teachers/${teacherId}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: ['Teacher'],
    }),
    rejectInstructorRequest: builder.mutation({
      query: (teacherId) => ({
        url: `${ADMIN_URL}/teachers/${teacherId}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: ['Teacher'],
    }),
    getAdminDashboardInfo: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/dashboard-info`, 
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useFetchAllTeachersQuery,
  useFetchAllStudentsQuery,
  useToggleBlockTeacherMutation,
  useToggleBlockStudentMutation,
  useAcceptInstructorRequestMutation,
  useRejectInstructorRequestMutation,
  useGetAdminDashboardInfoQuery
} = adminApiSlice;
