import Razorpay from '../utils/razorpayConfig.js'
import { createOrderUseCase,getOrderHistoryUseCase } from '../usecases/OrderUseCase.js';

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'order_rcptid_11', 
    };

    const order = await Razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    const userId = req.user.id;

    const order = await createOrderUseCase({ paymentId, amount, userId });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error in createOrderController:", error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id; 
    const orders = await getOrderHistoryUseCase(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order history' });
  }
};

export {
  createRazorpayOrder,createOrder,getOrderHistory
};
