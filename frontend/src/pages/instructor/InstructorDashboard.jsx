import React from 'react';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { useGetDashboardInfoQuery } from '../../store/instructorApiSlice';

const InstructorDashboard = () => {
  
  const { data: dashboardInfo, isLoading, error } = useGetDashboardInfoQuery();

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Failed to load dashboard info</Alert>;

  return (
    <div className="instructor-dashboard">
      <h1 className="mb-4">Instructor Dashboard</h1>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>{dashboardInfo?.totalCourses || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <Card.Text>{dashboardInfo?.totalStudents || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Earnings</Card.Title>
              <Card.Text>${dashboardInfo?.totalEarnings || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>New Messages</Card.Title>
              <Card.Text>{dashboardInfo?.newMessages || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Create a New Course</Card.Title>
              <Card.Text>
                Start creating a new course for your students.
              </Card.Text>
              <Link to="/instructor/courses/create-course">
                <Button variant="primary">Create Course</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>View All Courses</Card.Title>
              <Card.Text>
                Manage your existing courses and view details.
              </Card.Text>
              <Link to="/instructor/courses">
                <Button variant="success">View Courses</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>View Earnings</Card.Title>
              <Card.Text>
                Check your earnings and payment history.
              </Card.Text>
              <Link to="/instructor/earnings">
                <Button variant="warning">View Earnings</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <h2 className="mb-4">Recent Activity</h2>
      <Card>
        <Card.Body>
          <Card.Text>
            <ul>
              {dashboardInfo?.recentActivities?.map((activity, index) => (
                <li key={index}>{activity}</li>
              )) || <li>No recent activity</li>}
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
