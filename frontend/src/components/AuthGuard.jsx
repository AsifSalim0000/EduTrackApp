import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useGetUserStatusQuery } from '../store/userApiSlice';
import { logout } from '../store/authSlice';

const AuthGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const location = useLocation(); // Detect route changes
  const { data, error, isLoading: isFetching, refetch } = useGetUserStatusQuery();

  // Trigger refetch when the route changes
  useEffect(() => {
    if (userInfo) {
      refetch(); // Manually refetch user status on route change
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userInfo || isBlocked) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
