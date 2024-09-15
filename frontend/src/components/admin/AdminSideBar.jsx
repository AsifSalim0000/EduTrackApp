import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ activeItem }) => {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="sidebar d-flex flex-column p-3"
      style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0, top: 0 }}
    >
      <Navbar.Brand href="/" className="mb-4 text-white">
        Admin Panel
      </Navbar.Brand>
      <Nav className="flex-column">
        <Nav.Link
          as={NavLink}
          to="/admin/dashboard"
          className={activeItem === 'dashboard' ? 'active' : ''}
        >
          Dashboard
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin/students"
          className={activeItem === 'students' ? 'active' : ''}
        >
          Students
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin/instructors"
          className={activeItem === 'instructors' ? 'active' : ''}
        >
          Instructors
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin/courses"
          className={activeItem === 'courses' ? 'active' : ''}
        >
          Courses
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/admin/logout"
          className={activeItem === 'logout' ? 'active' : ''}
        >
          Logout
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default AdminSidebar;
