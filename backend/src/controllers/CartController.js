import { addToCart, addToWishlist, getCartByUser, removeCourseFromCart  } from '../usecases/cartUseCases.js';

import { HttpStatus } from '../utils/HttpStatus.js'; 

const addCourseToCart = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;  

  try {
    const cart = await addToCart(userId, courseId);
    if (!cart) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Cart not found or failed to create cart' });
    }

    return res.status(HttpStatus.OK).json({ message: 'Course added to cart successfully', cart });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: error.message });
  }
};
const addCourseToWishlist = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;  

  try {
    const wishlist = await addToWishlist(userId, courseId);
    if (!wishlist) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Wishlist not found or failed to create wishlist' });
    }

    return res.status(HttpStatus.OK).json({ message: 'Course added to Wishlist successfully' });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: error.message });
  }
};

const fetchCart = async (req, res) => {
  try {
    const cart = await getCartByUser(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { courseId } = req.body;
  try {
    const cart = await removeCourseFromCart(req.user.id, courseId);
    res.json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};


export { fetchCart, addCourseToCart, removeFromCart ,addCourseToWishlist};


