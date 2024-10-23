import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './UserDashboard.css';
import { useGetMyCoursesQuery, useGetUserCourseProgressQuery } from '../../store/userApiSlice';
import CoursesList from './CoursesList';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: myCoursesData, error: myCoursesError, isLoading: myCoursesLoading } = useGetMyCoursesQuery({ page: 1, limit: 6, search: '' });
  const { data: courseProgressData, error: courseProgressError, isLoading: courseProgressLoading } = useGetUserCourseProgressQuery();

  if (myCoursesLoading || courseProgressLoading) return <div>Loading...</div>;
  if (myCoursesError || courseProgressError) return <div>Error fetching data</div>;

  const enrolledCourses = myCoursesData?.courses || [];
  const progress = courseProgressData?.progress || {};

  const activeCourses = enrolledCourses.filter(course => progress[course._id]?.progress > 0 && progress[course._id]?.progress < 100).length;
  const completedCourses = enrolledCourses.filter(course => progress[course._id]?.progress === 100).length;

  const courseInstructors = Array.from(new Set(enrolledCourses.map(course => course.instructor))).length;

  return (
    <Container fluid className="dashboard-content p-4">
      <Row className="mb-4 text-center">
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>{enrolledCourses.length}</h3>
            <p>Enrolled Courses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>{activeCourses}</h3>
            <p>Active Courses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>{completedCourses}</h3>
            <p>Completed Courses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>{courseInstructors}</h3>
            <p>Course Instructors</p>
          </div>
        </Col>
      </Row>

      <Row className="course-section">
        <Col>
          <h3 className="mb-4">Let's start learning, {userInfo.username}</h3>
          <CoursesList/>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
