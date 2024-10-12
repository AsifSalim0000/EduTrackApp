import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import './UserDashboardLayout.css';
import { useSelector } from 'react-redux';
import defaultimage from '../../assets/avatar.png';


const UserDashboardLayout = () => {

    const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <Container fluid className="dashboard-layout p-4">
      <Row className="align-items-center mb-4">
        <Col md={2} className="text-center">
          <img
            className="rounded-circle profile-pic"
            src={`${userInfo.profileImage}` || defaultimage}
            alt="Profile"
          />
        </Col>
        <Col md={8}>
          <h2 className="mb-1">{userInfo.username}</h2>
          <p className="text-muted">Good Morning , Have a nice day!!</p>
        </Col>
        <Col md={2} className="text-md-right">
          {userInfo.role === 'Instructor' ? (
            <Nav.Link as={NavLink} to="/instructor/dashboard">
              <Button variant="outline-primary">Instructor Dashboard</Button>
            </Nav.Link>
          ) : (
            <Nav.Link as={NavLink} to="/become-a-tutor">
            <Button variant="outline-primary">Become Instructor </Button>
            </Nav.Link>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Nav fill variant="tabs" defaultActiveKey="/profile/dashboard">
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/dashboard">
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/courses">
                Courses
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/teachers">
                Teachers
              </Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/messages">
                Messages
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/wishlist">
                Wishlist
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/purchase-history">
                Purchase History
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/profile/settings">
                Settings
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      {/* Outlet for the dashboard pages */}
      <Outlet />
    </Container>
  );
};

export default UserDashboardLayout;
