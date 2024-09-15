import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSideBar';

const AdminLayout = ({ activeItem }) => {
  return (
    <div className="d-flex">
      <AdminSidebar activeItem={activeItem} />
      <Container fluid className="p-4" style={{ marginLeft: '250px' }}>
        <Row>
          <Col>
            <Outlet /> 
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;
