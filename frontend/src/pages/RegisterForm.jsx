import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useSendOtpMutation, useGoogleAuthMutation } from '../store/userApiSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { GoogleLogin } from '@react-oauth/google';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null); 
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [googleAuth, { isLoading: googleLoading }] = useGoogleAuthMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const validatePassword = (password) => {
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push("Password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password)) passwordErrors.push("Password must contain at least one uppercase letter.");
    if (!/[a-z]/.test(password)) passwordErrors.push("Password must contain at least one lowercase letter.");
    if (!/[0-9]/.test(password)) passwordErrors.push("Password must contain at least one digit.");
    if (!/[^A-Za-z0-9]/.test(password)) passwordErrors.push("Password must contain at least one special character.");
    
    return passwordErrors.length ? passwordErrors : null; 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      const passwordError = validatePassword(value.trim());
      setErrors({ ...errors, password: passwordError });
    }

    if (name === 'confirmPassword') {
      setErrors({ ...errors, confirmPassword: value.trim() !== formData.password ? 'Passwords do not match' : null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const username = formData.username.trim();
    const password = formData.password.trim();

    const newErrors = {
      email: !email ? 'Email is required' : null,
      username: !username ? 'Username is required' : null,
      password: validatePassword(password),
      confirmPassword: formData.confirmPassword.trim() !== password ? 'Passwords do not match' : null,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (hasErrors) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    try {
      await sendOtp({ email, username, password }).unwrap();
      toast.success('OTP sent successfully');
      navigate('/verify-otp');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      setError(err.data?.error || 'An error occurred');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await googleAuth(response.credential).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged in with Google successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Google sign-in failed');
    }
  };

  const handleGoogleError = (error) => {
    console.error(error);
    toast.error('Google sign-in failed');
  };

  return (
    <FormContainer>
      <h1 className="mb-4">Create Account</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </Form.Group>

        <Form.Group className="my-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
          />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </Form.Group>

        <Form.Group className="my-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
          {errors.password && (
            <div className="text-danger">
              {errors.password.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </Form.Group>

        <Form.Group className="my-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
          />
          {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-4 w-100" disabled={isLoading}>
          Sign Up / Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none">
            Login Here
          </Link>
        </Col>
      </Row>
      
      <Row className="py-3">
        <Col className="text-center">
          <GoogleLogin className="w-100"
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterForm;
