import React from 'react';
import { AiFillHeart } from 'react-icons/ai';  
import './Wishlist.css';
import { useGetWishlistQuery } from '../../store/userApiSlice';  // Import the hook

const Wishlist = () => {
  const { data: wishlist, isLoading, isError } = useGetWishlistQuery();

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
                  src={`/src/assets/uploads/${courseItem.courseId.thumbnail}` || 'https://via.placeholder.com/100x60'}
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
                <button className="btn wishlist-add-to-cart-btn">Add To Cart</button>
                <AiFillHeart className="wishlist-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Wishlist;
