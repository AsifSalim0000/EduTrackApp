import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation,useSearchCoursesMutation } from '../store/userApiSlice';
import { logout } from '../store/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HeaderNavbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [logoutApiCall] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchCourses] = useSearchCoursesMutation();

    const handleLogout = async (e) => {
        e.preventDefault();
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/');
    };
    const handleSearchChange = async (e) => {
        setSearch(e.target.value);
        if (e.target.value) {
            const response = await searchCourses({ query: e.target.value }).unwrap();
            setSuggestions(response); 
        } else {
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?query=${search}`);
    };

    return (
        <nav className="navbar shadow navbar-expand-lg navbar-light bg-light sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">EduTrack</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile/courses">Courses</Link>
                        </li>
                        {userInfo?.role === 'Instructor' ? (
                            <li className="nav-item">
                                <Link className="nav-link" to="/instructor/dashboard">Instructor Dashboard</Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/become-a-tutor">Become a Tutor</Link>
                            </li>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/pricing">Price & Planning</Link>
                        </li>
                    </ul>
                    <form className="d-flex ms-auto" onSubmit={handleSearchSubmit}>
                        <input 
                            className="form-control me-2" 
                            type="search" 
                            placeholder="Search courses" 
                            aria-label="Search" 
                            value={search} 
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-outline-success" type="submit">
                            <i className="bi bi-search"></i>
                        </button>

                        {/* Suggestions dropdown */}
                        {suggestions.length > 0 && (
                            <ul className="list-group position-absolute mt-5 search-suggestions">
                                {suggestions.map((course) => (
                                    <li 
                                        key={course._id} 
                                        className="list-group-item"
                                        onClick={() => navigate(`/coursedetails/${course._id}`)}
                                    >
                                        {course.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                    <ul className="navbar-nav ms-3">
                        {userInfo ? (
                            <>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">
                                        <i className="bi bi-cart"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/wishlist">
                                        <i className="bi bi-heart"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile/dashboard">
                                        <i className="bi bi-person"></i>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn btn-dark me-2" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-dark" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HeaderNavbar;
