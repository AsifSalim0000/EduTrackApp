import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../store/userApiSlice';

const LogoutButton = () => {
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            // Clear user-related data here if necessary
            navigate('/login');
        } catch (err) {
            console.error('Failed to logout:', err);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            Logout
        </button>
    );
};

export default LogoutButton;
