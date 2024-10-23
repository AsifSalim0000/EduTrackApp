import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAddToCartMutation, useAddToWishlistMutation, useSearchFilterCoursesMutation } from '../store/userApiSlice';
import CourseCard from '../components/CourseCard';

const CourseSearchResultsPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query'); 
    const [searchCourses] = useSearchFilterCoursesMutation(); 

    const [courses, setCourses] = useState([]); 
    const [filters, setFilters] = useState({
        priceRange: [0, 1000], 
        tags: '',
        rating: 0, 
    });

    const [addToCart] = useAddToCartMutation();
    const [addToWishlist] = useAddToWishlistMutation();
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const result = await searchCourses({ query, filters }).unwrap(); 
                setCourses(result); 
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        fetchCourses();
    }, [query, filters, searchCourses]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value, 
        }));
    };
    const handlePriceRangeChange = (e, type) => {
        const value = Number(e.target.value);
        setFilters((prev) => ({
            ...prev,
            priceRange: type === 'min' ? [value, prev.priceRange[1]] : [prev.priceRange[0], value],
        }));
    };

    const handleAddToCart = async (courseId) => {
        try {
          await addToCart(courseId).unwrap();
          navigate("/cart");
          console.log(`Course ${courseId} added to cart`);
        } catch (error) {
          console.error('Failed to add course to cart', error);
        }
      };
    
      const handleAddToWishlist = async (courseId) => {
        try {
          await addToWishlist(courseId).unwrap();
          console.log(`Course ${courseId} added to wishlist`);
          navigate("/profile/wishlist");
        } catch (error) {
          console.error('Failed to add course to wishlist', error);
        }
      };
    
      const handleWatchLecture = (courseId) => {
        navigate(`/my-course/${courseId}`);
      };
      const handleCourseClick = (courseId) => {
        navigate(`/coursedetails/${courseId}`);
      };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar Filters */}
                <div className="col-md-3">
                    <h4>Filters</h4>
                    {/* Price Range Filter */}
                    <div className="mb-3">
                        <label className="form-label">Min Price</label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={filters.priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(e, 'min')}
                            className="form-range"
                        />
                        <div>Min Price: ${filters.priceRange[0]}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Max Price</label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={filters.priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(e, 'max')}
                            className="form-range"
                        />
                        <div>Max Price: ${filters.priceRange[1]}</div>
                    </div>
              
                    <div className="mb-3">
                        <label className="form-label">Tags</label>
                        <select
                            name="tags"
                            className="form-select"
                            onChange={handleFilterChange}
                        >
                            <option value="">All</option>
                       
                            {courses.map((course) =>
                                course.whatToTeach.map((tag, idx) => (
                                    <option key={idx} value={tag}>{tag}</option>
                                ))
                            )}
                        </select>
                    </div>
                    {/* Rating Filter */}
                    <div className="mb-3">
                        <label className="form-label">Rating</label>
                        <select
                            name="rating"
                            className="form-select"
                            onChange={handleFilterChange}
                        >
                            <option value="0">All</option>
                            <option value="1">1 Star & above</option>
                            <option value="2">2 Stars & above</option>
                            <option value="3">3 Stars & above</option>
                            <option value="4">4 Stars & above</option>
                        </select>
                    </div>
                </div>

                {/* Course Results */}
                <div className="col-md-9">
                    <h4>Search Results for "{query}"</h4>
                    <div className="row">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <div key={course._id} className="col-md-4 mb-4">
                                    <CourseCard
                                        image={course.thumbnail}
                                        title={course.title}
                                        price={`$${course.price}`}
                                        rating={course.rating}
                                        isPurchased={course.isPurchased}
                                        onAddToCart={() => handleAddToCart(course._id)}
                                        onAddToWishlist={() => handleAddToWishlist(course._id)}
                                        onClick={() => handleCourseClick(course._id)}
                                        onWatchLecture={() => handleWatchLecture(course._id)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No courses found for your search.</p> 
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSearchResultsPage;
