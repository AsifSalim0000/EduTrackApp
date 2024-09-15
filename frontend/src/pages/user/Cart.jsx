import React, { useEffect } from 'react';
import { useGetCartQuery, useAddToWishlistMutation, useRemoveFromCartMutation } from '../../store/userApiSlice';
import Swal from 'sweetalert2';
import { Container, Row, Col, Button, Table, Image } from 'react-bootstrap';
import { FaRegHeart } from 'react-icons/fa'; 
import './Checkout.css'
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { data: cart, isLoading, error, refetch } = useGetCartQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const navigate=useNavigate()

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAddToWishlist = async (courseId) => {
    await addToWishlist(courseId);
    refetch();
  };
  const handleCheckout=()=>{
    navigate('/checkout')
  }
  const handleRemoveFromCart = async (courseId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeFromCart(courseId);
        refetch();
        Swal.fire('Removed!', 'The course has been removed from your cart.', 'success');
      }
    });
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Cart</h2>
          <p>
            <span>Home</span> / <span>Cart</span>
          </p>
        </Col>
      </Row>

      {isLoading ? (
        <Row>
          <Col>
            <p>Loading...</p>
          </Col>
        </Row>
      ) : error ? (
        
            <Container className="d-flex flex-column justify-content-center align-items-center min-vh-50">
              <Row>
                <Col className="text-center">
                  <h1 className="display-1">: (</h1>
                  <h2 className="display-2">Nothing in Cart?</h2>
                  <p className="lead">
                    Add Something in cart.
                  </p>
                  <Button as={Link} to="/" variant="primary" className='btnHome'>
                    Go Home
                  </Button>
                </Col>
              </Row>
            </Container>
      
      ) : (
        <>
          <Row>
            <Col md={8}>
              <Table responsive  hover>
                <thead className="thead-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.items.map((item) => (
                    <tr key={item.courseId._id}>
                      <td className="d-flex align-items-center">
                        <Image
                          src={`/src/assets/uploads/${item.courseId.thumbnail}`}
                          alt={item.courseId.title}
                          width={100}
                          height={60}
                          className="mr-3 me-4"
                          rounded
                        />
                        <div>
                          <p>{item.courseId.title}</p>
                          <Button
                            variant="link"
                            className="p-0 text-danger" // Makes the heart icon red
                            onClick={() => handleAddToWishlist(item.courseId._id)}
                          >
                            <FaRegHeart size={20} />
                          </Button>
                        </div>
                      </td>
                      <td>₹{item.courseId.price}</td>
                      <td>₹{item.courseId.price}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemoveFromCart(item.courseId._id)}
                        >
                          ✖
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            <Col md={4}>
              <div className="border p-3">
                <h4>Cart Summary</h4>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{cart?.items.reduce((total, item) => total + item.courseId.price, 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total:</span>
                  <span>₹{cart?.items.reduce((total, item) => total + item.courseId.price, 0)}</span>
                </div>
                <Button variant="primary" className="w-100 mt-3" onClick={()=> handleCheckout()}>
                  Proceed to Checkout
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
