import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Table, Image, Modal } from "react-bootstrap";
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { useGetCartQuery, useCreateRazorpayOrderMutation, useCreateOrderMutation } from '../../store/userApiSlice'; 
import { Link, useNavigate } from "react-router-dom";
import { BsFillCheckCircleFill } from "react-icons/bs";
import './Checkout.css'; // For custom CSS

const Checkout = () => {
  const [selectedPayment, setSelectedPayment] = useState("Visa");
  const { data: cartDetails, error, isLoading } = useGetCartQuery();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [createOrder] = useCreateOrderMutation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handlePaymentChange = (method) => setSelectedPayment(method);

  const handleRazorpayPayment = async () => {
    try {
      const totalAmount = calculateTotal() + 50; 

      const response = await createRazorpayOrder(totalAmount).unwrap();
      const { amount: razorpayAmount, id: order_id } = response;

      const options = {
        key: "rzp_test_wBmlqYoJ9oLqUC",
        amount: razorpayAmount,
        order_id,
        handler: async function (response) {
          try {
            await createOrder({
              items: cartDetails.items.map(item => ({
                courseId: item.courseId._id,
                price: item.courseId.price
              })),
              amount: totalAmount,
              paymentId: response.razorpay_payment_id,
              status: 'Completed'
            }).unwrap();

            // Show success modal
            setShowSuccessModal(true);
          } catch (error) {
            console.error("Error creating order:", error);
            alert("Payment Successful but Failed to Create Order.");
          }
        },
        prefill: {
          name: "Asif S",
          email: "asifsalim0000@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  const calculateTotal = () => {
    return cartDetails ? cartDetails.items.reduce((sum, item) => sum + item.courseId.price, 0) : 0;
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return(  
   <Container className="d-flex flex-column justify-content-center align-items-center min-vh-50">
    <Row>
      <Col className="text-center">
        <h1 className="display-1">: (</h1>
        <h2 className="display-2">Nothing in Checkout...</h2>
        <p className="lead">Add Something in cart.</p>
        <Button as={Link} to="/" variant="primary" className='btnHome'>Go Home</Button>
      </Col>
    </Row>
  </Container>) 

  return (
    <Container className="mt-5">
      <Row className="my-4">
        <Col>
          <h2>Checkout</h2>
          <Breadcrumb>
            <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="#">Cart</Breadcrumb.Item>
            <Breadcrumb.Item active>Checkout</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Row>
        <Col md={7}>
          <h3 className="mb-4">Payment Method</h3>
          <Card className="mb-3">
            <Card.Body>
              <Form.Check type="radio" label={<><FaCcVisa size={24} className="me-2"/> VISA **** 4855 (Exp 04/24)</>} name="paymentMethod" id="visa" checked={selectedPayment === "Visa"} onChange={() => handlePaymentChange("Visa")} />
              <Form.Check type="radio" label={<><FaCcMastercard size={24} className="me-2"/> MasterCard **** 5795 (Exp 04/24)</>} name="paymentMethod" id="mastercard" checked={selectedPayment === "MasterCard"} onChange={() => handlePaymentChange("MasterCard")} />
              <Form.Check type="radio" label={<><FaPaypal size={24} className="me-2"/> PayPal</>} name="paymentMethod" id="paypal" checked={selectedPayment === "PayPal"} onChange={() => handlePaymentChange("PayPal")} />
            </Card.Body>
          </Card>
          <Button variant="primary" className="mt-3 w-100" onClick={handleRazorpayPayment}>Complete Payment</Button>
        </Col>

        <Col md={5}>
          <h3 className="mb-4">Order Summary</h3>
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead className="thead-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartDetails?.items.map((item, index) => (
                    <tr key={index}>
                      <td className="d-flex align-items-center">
                        <Image src={`${item.courseId.thumbnail}`} alt={item.name} width={100} height={60} className="me-4" rounded />
                        <div><p>{item.courseId.title}</p></div>
                      </td>
                      <td>₹{item.courseId.price}</td>
                    </tr>
                  ))}  
                </tbody>
              </Table>
              <hr />
              <Row>
                <Col>Subtotal:</Col>
                <Col className="text-end">₹{calculateTotal()}</Col>
              </Row>
              <Row>
                <Col>Tax:</Col>
                <Col className="text-end">₹50</Col>
              </Row>
              <hr />
              <Row>
                <Col><strong>Total:</strong></Col>
                <Col className="text-end"><strong>₹{calculateTotal() + 50}</strong></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal with Countdown */}
      <SuccessModal show={showSuccessModal} handleClose={() => setShowSuccessModal(false)} />
    </Container>
  );
};

const SuccessModal = ({ show, handleClose }) => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(interval);
        handleClose();
        navigate('/');
      }

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [countdown, show, handleClose, navigate]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="success-modal"
      animation={true}
    >
      <Modal.Header className="justify-content-center success-modal-header">
        <Modal.Title>
          <BsFillCheckCircleFill size={50} color="green" />
          <span className="ms-3">Order Successful!</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <h4 className="mb-4">Thank you for your purchase!</h4>
        <p className="lead">
          Your payment was successfully completed. Redirecting to the homepage in {countdown} seconds...
        </p>
        <div className="celebration-animation">
          {/* Add any celebratory effects here */}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={handleClose}>
          Go to Home Now
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Checkout;
