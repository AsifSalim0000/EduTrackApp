import { findCartByUserId, createCart, addItemToCart,removeItemFromCart } from '../repositories/CartRepository.js';

const addToCart = async (userId, courseId) => {
  let cart = await findCartByUserId(userId);

  if (!cart) {
    cart = await createCart(userId, courseId);
  } else {
    cart = await addItemToCart(userId, courseId);
  }

  return cart;
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
  


  export {addToCart,getCartByUser,removeCourseFromCart}