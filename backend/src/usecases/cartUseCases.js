import { findCartByUserId, createCart, addItemToCart,removeItemFromCart } from '../repositories/CartRepository.js';
import { addItemToWishlist, createWishlist, findWishlistByUserId, getWishlistByUserId, removeItemFromWishlist } from '../repositories/WishlistRepository.js';

const addToCart = async (userId, courseId) => {
  let cart = await findCartByUserId(userId);

  if (!cart) {
    cart = await createCart(userId, courseId);
  } else {
    cart = await addItemToCart(userId, courseId);
  }

  return cart;
};
const addToWishlist = async (userId, courseId) => {
  let wishlist = await findWishlistByUserId(userId);

  if (!wishlist) {
    wishlist = await createWishlist(userId, courseId);
  } else {
    wishlist = await addItemToWishlist(userId, courseId);
  }

  return wishlist;
};
const getCartByUser = async (userId) => {
    const cart = await findCartByUserId(userId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  };
  
  
  const removeCourseFromCart = async (userId, courseId) => {
    return await removeItemFromCart(userId, courseId);
  };

const fetchWishlistForUser = async (userId) => {
  const wishlist = await getWishlistByUserId(userId);
  if (!wishlist) {
    throw new Error('Wishlist not found for the user');
  }
  return wishlist;
};

const removeFromWishlist = async (userId, courseId) => {

  const wishlist = await findWishlistByUserId(userId);
  console.log(wishlist);

  if (!wishlist || !wishlist.courses || wishlist.courses.length === 0) {
    return null;
  }

  const courseExists = wishlist.courses.some(course => course.courseId && course.courseId._id.toString() === courseId);

  if (!courseExists) {
    return null;
  }

  const updatedWishlist = await removeItemFromWishlist(userId, courseId);

  return updatedWishlist;
};



export {addToCart,getCartByUser,removeCourseFromCart,addToWishlist,fetchWishlistForUser,removeFromWishlist}