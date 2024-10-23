import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const InstructorSidebar = ({ activeItem }) => {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      className="sidebar rounded-start-5 d-flex flex-column p-3"
      style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0, top: 0 }}
    >
      <Navbar.Brand href="/" className="mb-4 text-white">
        EduTrack
      </Navbar.Brand>
      <Nav className="flex-column">
        <Nav.Link
          as={NavLink}
          to="/instructor/dashboard"
          className={activeItem === 'dashboard' ? 'active' : ''}
        >
          Dashboard
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/instructor/courses"
          className={activeItem === 'courses' ? 'active' : ''}
        >
          Courses
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/instructor/messages"
          className={activeItem === 'messages' ? 'active' : ''}
        >
          Messages
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/instructor/earnings"
          className={activeItem === 'earnings' ? 'active' : ''}
        >
          Earnings
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/instructor/reports"
          className={activeItem === 'reports' ? 'active' : ''}
        >
        Reports
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/instructor/logout"
          className={activeItem === 'logout' ? 'active' : ''}
        >
          Logout
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default InstructorSidebar;
