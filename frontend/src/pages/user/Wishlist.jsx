import React, { useEffect } from 'react';
import { AiFillHeart } from 'react-icons/ai';  
import './Wishlist.css';
import { useGetWishlistQuery, useRemoveFromWishlistMutation, useAddToCartMutation } from '../../store/userApiSlice';  // Import the hooks
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { data: wishlist, isLoading, isError, refetch } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAdding, error: addError }] = useAddToCartMutation(); 
  const navigate= useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);
  
  const handleRemove = async (courseId) => {
    try {
      await removeFromWishlist(courseId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to remove from wishlist: ", error);
    }
  };

  const handleAddToCart = async (courseId) => {
    try {
      await addToCart(courseId).unwrap(); // Add course to cart
      console.log(`Course ${courseId} added to cart successfully`);
      navigate('/cart')
    } catch (error) {
      console.error("Failed to add course to cart", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load wishlist</p>;
  }

  return (
    <div className="wishlist-container my-4">
      <h2 className="wishlist-header">Wishlist ({wishlist?.courses?.length || 0})</h2>
      <table className="wishlist-table table table-striped table-borderless">
        <thead className="thead-light">
          <tr>
            <th>Course</th>
            <th>Prices</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {wishlist?.courses?.map((courseItem) => (
            <tr key={courseItem.courseId._id}>
              <td className="wishlist-course-info">
                <img
                  src={`${courseItem.courseId.thumbnail}` || 'https://via.placeholder.com/100x60'}
                  className="wishlist-course-img"
                  alt="course-img"
                />
                <div>
                  <p className="mb-0 wishlist-course-title">{courseItem.courseId.title}</p>
                  <p className="text-muted">
                    Course by: {courseItem.courseId.instructor?.username || 'Unknown'}
                  </p>
                  <span className="wishlist-star-rating">
                    ⭐ {courseItem.courseId.rating || 'N/A'} ({courseItem.courseId.reviews || 'No Reviews'})
                  </span>
                </div>
              </td>
              <td>
                <p className="wishlist-price-discount">
                  ${courseItem.courseId.price} <span className="text-muted">$49.00</span>
                </p>
              </td>
              <td>
                <button className="btn btn-outline-primary wishlist-buy-now-btn">Buy Now</button>
                <button className="btn wishlist-add-to-cart-btn" onClick={() => handleAddToCart(courseItem.courseId._id)} disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add To Cart'}
                </button>
                <AiFillHeart 
                  className="wishlist-icon" 
                  onClick={() => handleRemove(courseItem.courseId._id)}  // Call handleRemove on click
                />
                {addError && <p className="text-danger mt-2">Failed to add to cart</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wishlist;
