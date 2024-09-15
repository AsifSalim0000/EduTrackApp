import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; 

const NotFoundPage = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Row>
        <Col className="text-center">
          <h1 className="display-1">404</h1>
          <h2 className="display-2">Page Not Found</h2>
          <p className="lead">
            Sorry, the page you're looking for doesn't exist.
          </p>
          <Button as={Link} to="/" variant="primary" className='btnHome'>
            Go Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
