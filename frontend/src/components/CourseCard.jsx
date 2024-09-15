import React from 'react';
import { Button, Card } from 'react-bootstrap';
import './CourseCard.css';

const CourseCard = ({ image, title, price, rating, onAddToCart, onAddToWishlist, onClick }) => (
  <Card className="course-card h-100">
    <div className="image-container" onClick={onClick}>
      <Card.Img variant="top" src={`/src/assets/uploads/${image}`} className="course-image" />
      <div className="overlay">
        <Button
          variant="outline-light"
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating when Add to Cart is clicked
            onAddToCart();
          }}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline-light"
          className="ms-2"
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating when Wishlist is clicked
            onAddToWishlist();
          }}
        >
          Wishlist
        </Button>
      </div>
    </div>
    <Card.Body onClick={onClick}>
      <Card.Title className="course-title">{title}</Card.Title>
      <Card.Text className="course-price">Price: {price}</Card.Text>
      <Card.Text className="course-rating">Rating: {rating} ★</Card.Text>
    </Card.Body>
  </Card>
);

export default CourseCard;
