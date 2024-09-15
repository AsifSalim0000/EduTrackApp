import Cart from '../domain/Cart.js';

// Find user's cart by userId
const findCartByUserId = async (userId) => {
  return await Cart.findOne({ userId }).populate('items.courseId');
};


const createCart = async (userId, courseId) => {
  const newCart = new Cart({
    userId,
    items: [{ courseId }],
  });
  return await newCart.save();
};

const addItemToCart = async (userId, courseId) => {
  const cart = await findCartByUserId(userId);
  if (!cart) return null;
  cart.items.push({ courseId });
  return await cart.save();
};

const updateCartTimestamp = async (cartId) => {
  return await Cart.findByIdAndUpdate(cartId, { updatedAt: Date.now() });
};

const removeItemFromCart = async (userId, courseId) => {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { courseId } } },
      { new: true }
    );
    return cart;
  };
  
 const deleteCart = async (userId) => {
    return await Cart.deleteOne({ userId });
  };
export {findCartByUserId,createCart,addItemToCart,updateCartTimestamp,removeItemFromCart,deleteCart}