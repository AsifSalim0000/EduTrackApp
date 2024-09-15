import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation, useUpdatePasswordMutation } from '../../store/userApiSlice'; 
import { setCredentials } from "../../store/authSlice";
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/avatar.png';
import Swal from 'sweetalert2';

const AccountSettings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultAvatar);

  useEffect(() => {
    if (userInfo.profileImage) {
      setImagePreview(`/src/assets/uploads/${userInfo.profileImage}`);
    } else {
      setImagePreview(defaultAvatar);
    }
  }, [userInfo.profileImage]);

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const [formData, setFormData] = useState({
    username: userInfo.username,
    title: userInfo.title,
    email: userInfo.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const password = e.target.value;
    if (password.length >= 8 && password.match(/[A-Z]/) && password.match(/[a-z]/) && password.match(/[0-9]/)) {
      setPasswordStrength('Strong');
    } else if (password.length >= 6) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Weak');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
  
    const userFormData = new FormData();
    userFormData.append('username', formData.username);
    userFormData.append('title', formData.title);
  
    if (selectedImageFile instanceof File) {
      userFormData.append('profileImage', selectedImageFile);
    }
  
    try {

      const result = await updateUser(userFormData).unwrap();
      
      if (result) {
        dispatch(setCredentials(result));
        Swal.fire('Success', 'Profile updated successfully!', 'success');
      }
  
      setIsUpdating(false);
      navigate('/profile/settings');
    } catch (error) {
      setIsUpdating(false);
      console.error('Error updating user:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };
  

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength === 'Weak') {
      Swal.fire('Weak Password', 'Password must be stronger.', 'warning');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Password Mismatch', 'New password and confirm password do not match.', 'warning');
      return;
    }

    setIsPasswordUpdating(true);
    try {
      await updatePassword(passwordData);
      setIsPasswordUpdating(false);
      Swal.fire('Success', 'Password updated successfully!', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      Swal.fire('Error', 'Could not update password. Try again later.', 'error');
      setIsPasswordUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="row">
        <div className="col-md-4">
          <h3 className="text-xl font-bold mb-2">Profile</h3>
          <div className="mb-3">
            <label htmlFor="profileImage" className="form-label">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              name="profileImage" 
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <img 
            src={imagePreview} 
            alt="Profile" 
            className="img-fluid rounded-circle mb-3" 
            style={{ width: '150px', height: '150px' }} 
          />
        </div>
        <div className="col-md-8">
          <h3 className="text-xl font-bold mb-2">User Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                disabled
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </form>

          <h3 className="text-xl font-bold mb-2 mt-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="form-control"
              />
              <p className={`text-sm text-${passwordStrength === 'Strong' ? 'success' : passwordStrength === 'Medium' ? 'warning' : 'danger'}`}>
                Password Strength: {passwordStrength}
              </p>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="form-control"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPasswordUpdating}
            >
              {isPasswordUpdating ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
