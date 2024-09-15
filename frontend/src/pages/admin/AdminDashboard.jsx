import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard  bg-light">
      <h1 className="mb-4">Admin Dashboard</h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>45</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <Card.Text>1234</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>Total Instructors</Card.Title>
              <Card.Text>56</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white">
            <Card.Body>
              <Card.Title>New Messages</Card.Title>
              <Card.Text>12</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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

      <h2 className="mb-4">Recent Activity</h2>
      <Card bg="dark" text="white">
        <Card.Body>
          <Card.Text>
            <ul>
              <li>New student registered - 1 hour ago</li>
              <li>Course "React Advanced" updated by Instructor A - 2 hours ago</li>
              <li>Instructor B received a new message - 3 hours ago</li>
              <li>You processed a payment for Instructor C - 4 hours ago</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboard;
