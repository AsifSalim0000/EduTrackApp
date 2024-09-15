import React, { useState,useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForgotOtpMutation } from '../store/userApiSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ForgotPasswordEmailForm = () => {
  const [email, setEmail] = useState('');
  const [sendOtp, { isLoading }] = useForgotOtpMutation();
  const { userInfo } = useSelector((state) => state.auth);
  
const navigate= useNavigate();

useEffect(() => {
  if (userInfo) {
    navigate('/');
  }
}, [navigate, userInfo]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      await sendOtp({ email }).unwrap();
      toast.success('OTP has been sent to your email.');
      navigate('/forgotpassword-otp')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to send OTP');
    }
  };

  return (
    <FormContainer>
      <h1 className="mb-4">Forgot Password</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-4 w-100" disabled={isLoading}>
          Send OTP
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordEmailForm;
