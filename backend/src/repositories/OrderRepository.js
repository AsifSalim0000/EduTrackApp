import Order from '../domain/Order.js';

const saveOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};
export {saveOrder}