// createOrderUseCase.js

import { findCartByUserId, deleteCart } from '../repositories/CartRepository.js';
import { saveOrder } from '../repositories/OrderRepository.js';
import { findMyCoursesByUserId, saveMyCourses } from '../repositories/MyCoursesRepository.js';
import MyCourses from '../domain/MyCourses.js'; 

const createOrderUseCase = async ({ paymentId, amount, userId }) => {
  
  const cart = await findCartByUserId(userId);
  if (!cart) {
    throw new Error('Cart not found');
  }

  const orderItems = cart.items.map(item => ({
    courseId: item.courseId._id,
    price: item.courseId.price,
  }));

  const order = await saveOrder({
    userId,
    items: orderItems,
    amount,
    paymentId,
    status: 'Completed',
  });

  const orderedCourses = cart.items.map(item => ({ courseId: item.courseId._id }));

  let myCourses = await findMyCoursesByUserId(userId);

  if (!myCourses) {
    myCourses = new MyCourses({
      userId,
      courses: orderedCourses,
    });
  } else {
    orderedCourses.forEach(course => {
      if (!myCourses.courses.some(c => c.courseId.equals(course.courseId))) {
        myCourses.courses.push(course);
      }
    });
  }

  await saveMyCourses(myCourses);

  await deleteCart(userId);

  return order;
};

export { createOrderUseCase };
