import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useGetMyCoursesQuery } from '../../store/userApiSlice';
import CourseCard from './CourseCard';

const CoursesList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6); 
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate(); // Initialize the navigate hook

  const { data: coursesData, isLoading, isError, error } = useGetMyCoursesQuery({
    page,
    limit,
    search: searchQuery,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  if (isError) {
    return <p>Error fetching courses: {error.message}</p>;
  }

  const { courses, totalCourses } = coursesData || { courses: [], totalCourses: 0 };
  const totalPages = Math.ceil(totalCourses / limit);

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
          <div key={course.id} className="col-md-4">
        
            <CourseCard
              title={course.title}
              description={course.description}
              progress={course.progress}
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
          className="btn btn-primary"
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
