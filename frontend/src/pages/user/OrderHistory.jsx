import React, { useEffect } from 'react';
import { useGetOrderHistoryMutation } from '../../store/userApiSlice';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import './OrderHistory.css';

const OrderHistory = () => {
  const [getOrderHistory, { data: orderData, isLoading, error }] = useGetOrderHistoryMutation();

  useEffect(() => {
    getOrderHistory();
  }, [getOrderHistory]);

  if (isLoading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">Failed to load order history</Alert>;

  return (
    <Container className="order-history-page my-5">
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
    </Container>
  );
};

export default OrderHistory;
