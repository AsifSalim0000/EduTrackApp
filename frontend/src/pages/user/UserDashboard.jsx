import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <Container fluid className="dashboard-content p-4">
      <Row className="mb-4 text-center">
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>957</h3>
            <p>Enrolled Courses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>6</h3>
            <p>Active Courses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>951</h3>
            <p>Completed Courses</p>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-card bg-light p-3 rounded">
            <h3>241</h3>
            <p>Course Instructors</p>
          </div>
        </Col>
      </Row>

      <Row className="course-section">
        <Col>
          <h3 className="mb-4">Let's start learning, Kevin</h3>
          <Row>
            <Col md={4}>
              <div className="course-card card">
                <img
                  className="card-img-top"
                  src="image-url"
                  alt="Course"
                />
                <div className="card-body">
                  <h5 className="card-title">Reiki Level 1</h5>
                  <p className="card-text">Introductions</p>
                  <Button variant="warning">Watch Lecture</Button>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="course-card card">
                <img
                  className="card-img-top"
                  src="image-url"
                  alt="Course"
                />
                <div className="card-body">
                  <h5 className="card-title">
                    Complete 2021 Web Development Bootcamp
                  </h5>
                  <p className="card-text">61% Completed</p>
                  <Button variant="warning">Watch Lecture</Button>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="course-card card">
                <img
                  className="card-img-top"
                  src="image-url"
                  alt="Course"
                />
                <div className="card-body">
                  <h5 className="card-title">Copywriting with Figma</h5>
                  <p className="card-text">12% Completed</p>
                  <Button variant="warning">Watch Lecture</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
