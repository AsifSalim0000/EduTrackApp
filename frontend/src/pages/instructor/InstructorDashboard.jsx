import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

const InstructorDashboard = () => {
  return (
    <div className="instructor-dashboard">
      <h1 className="mb-4">Instructor Dashboard</h1>

   
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>12</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <Card.Text>345</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Earnings</Card.Title>
              <Card.Text>$23,456</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>New Messages</Card.Title>
              <Card.Text>5</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sample Action Buttons */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Create a New Course</Card.Title>
              <Card.Text>
                Start creating a new course for your students.
              </Card.Text>
              <Button variant="primary">Create Course</Button>
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
              <Button variant="success">View Courses</Button>
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
              <Button variant="warning">View Earnings</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sample Recent Activity Section */}
      <h2 className="mb-4">Recent Activity</h2>
      <Card>
        <Card.Body>
          <Card.Text>
            <ul>
              <li>New student enrolled in "React Basics" - 1 hour ago</li>
              <li>Course "Advanced JavaScript" received a new review - 2 hours ago</li>
              <li>You earned $200 from the sale of "Full Stack Development" - 3 hours ago</li>
              <li>New message from student John Doe - 4 hours ago</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
