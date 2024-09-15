import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginUserMutation, useGoogleAuthMutation } from '../store/userApiSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [googleAuth, { isLoading: googleLoading }] = useGoogleAuthMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!formData.password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await loginUser(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
      <h1 className="mb-4">Login</h1>
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
            isInvalid={!!emailError}
          />
          {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
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
            isInvalid={!!passwordError}
          />
          {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-4 w-100" disabled={isLoading}>
          Login
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col className="text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-decoration-none">
            Sign Up Here
          </Link>
        </Col>
      </Row>

      <Row className="py-3">
        <Col className="text-center">
          <GoogleLogin className='w-100'
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </Col>
      </Row>

      <Row className="py-3">
        <Col className="text-center">
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot Password?
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginForm;
