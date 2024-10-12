import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useGetUserStatusQuery, useRefreshAccessTokenMutation } from '../store/userApiSlice';
import { logout } from '../store/authSlice';

const AuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const location = useLocation();
  const { data, error, isLoading: isFetching, refetch } = useGetUserStatusQuery();

  const [refreshAccessToken] = useRefreshAccessTokenMutation();

  useEffect(() => {
    if (userInfo) {
      refetch();
    }
  }, [location, refetch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      if (isFetching) {
        setIsLoading(true);
      } else if (error) {
        console.error('Error fetching user status:', error);
        setIsLoading(false);
      } else if (data) {
        if (data.status === 'blocked') {
          setIsBlocked(true);
          dispatch(logout());
        } else {
          setIsBlocked(false);
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [data, error, isFetching, dispatch, userInfo]);

  useEffect(() => {
    const tokenExpirationCheck = async () => {
      // Instead of trying to read the cookie directly, make an API call to validate the session
      try {
        const result = await refreshAccessToken().unwrap(); // API call to get new access token
        if (result) {
          console.log('Access token refreshed successfully', result);
          refetch(); // Refresh user status
        }
      } catch (error) {
        console.error('Failed to refresh access token', error);
        dispatch(logout()); // Logout if unable to refresh
      }
    };
  
    // Check token expiration on load
    tokenExpirationCheck();
  
    // Set an interval to check every 10 minutes
    const interval = setInterval(() => {
      tokenExpirationCheck();
    }, 10 * 60 * 1000); // Every 10 minutes
  
    return () => clearInterval(interval);
  }, [refreshAccessToken, refetch, dispatch]);
  
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userInfo || isBlocked) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
