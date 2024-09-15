import React from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-1 border-top mt-5">
      <Container className='mt-5'>
        <Row>
          <Col md={4}>
            <h5>EduTrack</h5>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Enter your email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Button variant="primary" className="mt-2">Subscribe</Button>
            </Form.Group>
          </Col>
          <Col md={2}>
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li><a href="/privacy-policy" className="text-dark">Privacy Policy</a></li>
              <li><a href="/refund-policy" className="text-dark">Refund Policy</a></li>
              <li><a href="/plans-pricing" className="text-dark">Plans & Pricing</a></li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>Services</h5>
            <ul className="list-unstyled">
              <li><a href="/courses" className="text-dark">Courses</a></li>
              <li><a href="/become-tutor" className="text-dark">Become a Tutor</a></li>
              <li><a href="/other-services" className="text-dark">Other Services</a></li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><a href="/feedback" className="text-dark">Feedback</a></li>
              <li><a href="/contact-us" className="text-dark">Contact Us</a></li>
              <li><a href="/about-us" className="text-dark">About Us</a></li>
              <li><a href="/terms-conditions" className="text-dark">Terms & Conditions</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
