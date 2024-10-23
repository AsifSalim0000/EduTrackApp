import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useGetMyCoursesQuery, useGetUserCourseProgressQuery } from '../../store/userApiSlice'; 
import CourseCard from './CourseCard';

const CoursesList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6); 
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate(); 

  const { data: coursesData, isLoading: coursesLoading, isError: coursesError, error: coursesErrorMsg } = useGetMyCoursesQuery({
    page,
    limit,
    search: searchQuery,
  });

  const { data: progressData, isLoading: progressLoading } = useGetUserCourseProgressQuery();

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); 
  };

  if (coursesLoading || progressLoading) {
    return <p>Loading courses...</p>;
  }

  if (coursesError) {
    return <p>Error fetching courses: {coursesErrorMsg.message}</p>;
  }

  const { courses, totalCourses } = coursesData || { courses: [], totalCourses: 0 };
  const totalPages = Math.ceil(totalCourses / limit);

  // Map progress to courses
  const progressMap = {};
  progressData?.forEach((progress) => {
    progressMap[progress.courseId._id] = Math.floor(progress.progress);
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Courses ({courses.length})</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-4 mb-3">
            <CourseCard
              title={course.title}
              description={course.description}
              progress={progressMap[course._id] || 0} 
              thumbnail={course.thumbnail}
              onClick={() => {
                navigate(`/my-course/${course._id}`); 
              }}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-primary "
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CoursesList;
