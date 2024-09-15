import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useResetPasswordMutation } from '../store/userApiSlice';
import { useSelector } from 'react-redux';


const ResetPassword = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = formData;

    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await resetPassword( newPassword );
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <FormContainer>
      <h1 className="mb-4">Reset Password</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="my-3" controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <div className="input-group">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </div>
        </Form.Group>

        <Form.Group className="my-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <div className="input-group">
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              required
            />
            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </div>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-4 w-100" disabled={isLoading}>
          Reset Password
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ResetPassword;
