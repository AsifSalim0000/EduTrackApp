import { addToCart, getCartByUser, removeCourseFromCart  } from '../usecases/cartUseCases.js';

const addCourseToCart = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;  

  try {
    const cart = await addToCart(userId, courseId);
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found or failed to create cart' });
    }

    return res.status(200).json({ message: 'Course added to cart successfully', cart });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const fetchCart = async (req, res) => {
  try {
    const cart = await getCartByUser(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { courseId } = req.body;
  try {
    const cart = await removeCourseFromCart(req.user.id, courseId);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export { fetchCart, addCourseToCart, removeFromCart };


