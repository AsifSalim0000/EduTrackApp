import React, { useState } from 'react';
import { Col, Container, Row, Pagination } from 'react-bootstrap';
import CourseCard from './CourseCard';
import './CourseCard.css';
import { useNavigate } from 'react-router-dom';
import { useGetCoursesQuery, useAddToCartMutation, useAddToWishlistMutation } from '../store/userApiSlice';

const NewCourses = () => {
  const navigate = useNavigate();
  
  const [page, setPage] = useState(1); 
  
  const { data: coursesData, error, isLoading } = useGetCoursesQuery({ page });

  const [addToCart] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const handleCourseClick = (courseId) => {
    navigate(`/coursedetails/${courseId}`);
  };

  const handleAddToCart = async (courseId) => {
    try {
      await addToCart(courseId).unwrap();
      navigate("/cart");
      console.log(`Course ${courseId} added to cart`);
    } catch (error) {
      console.error('Failed to add course to cart', error);
    }
  };

  const handleAddToWishlist = async (courseId) => {
    try {
      await addToWishlist(courseId).unwrap();
      console.log(`Course ${courseId} added to wishlist`);
    } catch (error) {
      console.error('Failed to add course to wishlist', error);
    }
  };

  const handleWatchLecture = (courseId) => {
    navigate(`/my-course/${courseId}`);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  if (isLoading) return <p>Loading courses...</p>;
  if (error) return <p>Failed to load courses</p>;

  return (
    <Container className="new-courses my-5">
      <h2 className="text-center mb-4">New Courses</h2>
      <Row>
        {coursesData.data.map((course) => (
          <Col key={course._id} md={3} sm={6} className="mb-4">
            <CourseCard
              image={course.thumbnail}
              title={course.title}
              price={course.price}
              rating={course.rating}
              isPurchased={course.isPurchased}
              onAddToCart={() => handleAddToCart(course._id)} 
              onAddToWishlist={() => handleAddToWishlist(course._id)}
              onWatchLecture={() => handleWatchLecture(course._id)} // Pass the watch lecture handler
              onClick={() => handleCourseClick(course._id)} 
            />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        {[...Array(coursesData.totalPages)].map((_, index) => (
          <Pagination.Item 
            key={index + 1} 
            active={index + 1 === page} 
            onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default NewCourses;
