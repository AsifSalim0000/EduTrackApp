import Order from '../domain/Order.js';

const saveOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};
const getOrderHistoryFromRepo = async (userId) => {
  try {
  
    const orders = await Order.find({ userId })
  .populate({
    path: 'items.courseId',
    populate: {
      path: 'instructor', 
      model: 'User',   
    },
  });

    return orders;
  } catch (error) {
    throw new Error('Error fetching order history');
  }
};
export {saveOrder,getOrderHistoryFromRepo}