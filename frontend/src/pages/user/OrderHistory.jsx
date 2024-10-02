import React, { useEffect, useState } from 'react';
import { useGetOrderHistoryMutation, useAddReviewMutation, useGetUserReviewForCourseQuery } from '../../store/userApiSlice';
import { Container, Row, Col, Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './OrderHistory.css';

const OrderHistory = () => {
  const [getOrderHistory, { data: orderData, isLoading, error }] = useGetOrderHistoryMutation();
  const [addReview] = useAddReviewMutation();
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: userReviewData, refetch: fetchUserReview } = useGetUserReviewForCourseQuery(
    { courseId: selectedCourse?._id }, // Correctly pass an object with courseId
    {
      skip: !selectedCourse,
    }
  );

  useEffect(() => {
    getOrderHistory();
  }, [getOrderHistory]);

  useEffect(() => {
    if (selectedCourse) {
      fetchUserReview(); // Fetch user review when selectedCourse changes
    }
  }, [selectedCourse, fetchUserReview]);

  const handleReviewSubmit = async () => {
    try {
      await addReview({ courseId: selectedCourse._id, rating, comment });
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Thank you for your feedback.',
      });
      fetchUserReview(); // Optionally refetch the user reviews here to update the modal
    } catch (err) {
      console.error('Failed to submit review', err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Please try again.',
      });
    }
  };

  const handleWriteReviewClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setRating(0); // Reset rating when opening the modal
    setComment(''); // Reset comment when opening the modal
  };

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Failed to load order history</Alert>;

  return (
    <Container className="order-history-page my-5 h-auto">
      <h2 className="text-center mb-4">Order History</h2>
      {orderData && orderData.length > 0 ? (
        orderData.map((order) => (
          <Card key={order._id} className="mb-4 shadow-sm">
            <Row>
              <Col md={8}>
                {order.items.map((item) => (
                  <Row key={item.courseId} className="py-3 order-item">
                    <Col md={3}>
                      <img
                        src={`/src/assets/uploads/${item.courseId.thumbnail}`}
                        alt={item.courseId.title}
                        className="img-fluid"
                      />
                    </Col>
                    <Col md={9}>
                      <h5>{item.title}</h5>
                      <p>Course by: {item.courseId.instructor.username}</p>
                      <p className="text-warning">Rating: 4.7 ★ (451,444 Reviews)</p>
                      <p className="text-danger">${item.price.toFixed(2)}</p>
                      <Button variant="orangish" onClick={() => handleWriteReviewClick(item.courseId)}>
                        Write a Review
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col md={4} className="text-right d-flex flex-column justify-content-center">
                <p className="font-weight-bold">
                  {new Date(order.createdAt).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
                <p>
                  {order.items.length} Courses | ${order.amount.toFixed(2)} |{' '}
                  {order.paymentMethod === 'Credit Card' && (
                    <>
                      <i className="bi bi-credit-card-fill"></i> Credit Card{' '}
                      {order.cardDetails}
                    </>
                  )}
                </p>
              </Col>
            </Row>
          </Card>
        ))
      ) : (
        <Alert variant="info">No orders found</Alert>
      )}

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review for {selectedCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userReviewData && userReviewData.courseId === selectedCourse._id ? ( // Check if review data matches selected course
            <Alert variant="info">
              <h5>You've already reviewed this course:</h5>
              <p>Rating: {userReviewData.rating} ★</p>
              <p>Comment: {userReviewData.comment}</p>
            </Alert>
          ) : (
            <Form>
              <Form.Group controlId="formRating">
                <Form.Label>Rating</Form.Label>
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`star ${rating > index ? 'selected' : ''}`}
                      onClick={() => setRating(index + 1)}
                      role="button"
                      aria-label={`${index + 1} star`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </Form.Group>
              <Form.Group controlId="formComment">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {/* Show the Submit button only if there are no existing reviews */}
          {!userReviewData || userReviewData.courseId !== selectedCourse._id ? ( // Check for matching course ID
            <Button variant="orangish" onClick={handleReviewSubmit}>
              Submit Review
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderHistory;