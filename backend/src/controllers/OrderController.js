import Razorpay from '../utils/razorpayConfig.js'
import { createOrderUseCase,getOrderHistoryUseCase } from '../usecases/OrderUseCase.js';
import { HttpStatus } from '../utils/HttpStatus.js';

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
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create order' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    const userId = req.user.id;

    const order = await createOrderUseCase({ paymentId, amount, userId });

    res.status(HttpStatus.CREATED).json(order);
  } catch (error) {
    console.error("Error in createOrderController:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create order' });
  }
};
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id; 
    const orders = await getOrderHistoryUseCase(userId);
    res.status(HttpStatus.OK).json(orders);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch order history' });
  }
};

export {
  createRazorpayOrder,createOrder,getOrderHistory
};
