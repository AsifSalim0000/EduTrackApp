import React from 'react';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useGetAdminDashboardInfoQuery } from '../../store/adminApiSlice'; // Admin API hook

const AdminDashboard = () => {
  // Fetch the admin dashboard data using the mutation
  const { data: adminDashboardInfo, isLoading, error } = useGetAdminDashboardInfoQuery();

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Failed to load admin dashboard info</Alert>;

  return (
    <div className="admin-dashboard bg-light">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>{adminDashboardInfo?.totalCourses || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <Card.Text>{adminDashboardInfo?.totalStudents || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Total Instructors</Card.Title>
              <Card.Text>{adminDashboardInfo?.totalInstructors || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>New Messages</Card.Title>
              <Card.Text>{adminDashboardInfo?.newMessages || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col md={4}>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Manage Students</Card.Title>
              <Card.Text>View and manage all registered students.</Card.Text>
              <Button variant="primary">Manage Students</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Manage Instructors</Card.Title>
              <Card.Text>View and manage all instructors.</Card.Text>
              <Button variant="success">Manage Instructors</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Manage Courses</Card.Title>
              <Card.Text>View and manage all courses offered.</Card.Text>
              <Button variant="warning">Manage Courses</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <h2 className="mb-4">Recent Activity</h2>
      <Card bg="dark" text="white">
        <Card.Body>
          <Card.Text>
            <ul>
              {adminDashboardInfo?.recentActivities?.map((activity, index) => (
                <li key={index}>{activity}</li>
              )) || <li>No recent activity</li>}
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;
