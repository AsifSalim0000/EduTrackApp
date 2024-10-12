// MessageRepository.js
import Chat from '../domain/Chat.js';
import Message from '../domain/Message.js';
import MyCourses from '../domain/MyCourses.js';
import Instructor from '../domain/Instructor.js';
import Order from '../domain/Order.js';
import Course from '../domain/Course.js';

const findChat = async (userId, receiverId) => {
  return await Chat.findOne({
    users: { $all: [userId, receiverId] }
  });
};

const createChat = async (users) => {
  return await Chat.create({ users });
};


const createMessage = async (sender, content, chatId) => {
    const newMessage = await Message.create({
      sender,
      content,
      chat: chatId,
    });
  
    return await Message.findById(newMessage._id)
      .populate('sender', 'username profileImage')
      .populate('chat');
  };
  

const findMessages = async (chatId) => {
  return await Message.find({ chat: chatId })
    .populate('sender', 'username profileImage')
    .sort({ createdAt: 1 });
};

const findCoursesByUser = async (userId) => {
  return await MyCourses.findOne({ userId })
    .populate({
      path: 'courses.courseId',
      select: 'instructor',
      populate: {
        path: 'instructor',
        model: 'User',
        select: '_id username profileImage email title',
      },
    });
};

const findInstructorsByUserIds = async (instructorUserIds) => {
  return await Instructor.find({ userId: { $in: instructorUserIds } })
    .populate({
      path: 'userId',
      model: 'User',
      select: '_id username profileImage email title',
    });
};

const getStudentsByInstructorId = async (instructorId) => {
  try {

    const courses = await Course.find({ instructor: instructorId }).select('_id');
    const courseIds = courses.map(course => course._id);

    const orders = await Order.find({ 'items.courseId': { $in: courseIds } })
      .populate('userId', 'username profileImage');

    const studentMap = new Map();

    orders.forEach(order => {
      const student = order.userId;
      if (!studentMap.has(student._id.toString())) {
        studentMap.set(student._id.toString(), {
          _id: student._id,
          username: student.username,
          profileImage: student.profileImage,
        });
      }
    });

    const uniqueStudents = Array.from(studentMap.values());

    return uniqueStudents;
  } catch (error) {
    throw new Error('Error fetching students by instructor ID');
  }
};
const deleteMessageById = async (messageId) => {
  return await Message.findByIdAndDelete(messageId);
};

const findMessageById = async (messageId) => {
  return await Message.findById(messageId);
};


export { findChat, createChat, createMessage, findMessages, findCoursesByUser, findInstructorsByUserIds,getStudentsByInstructorId, deleteMessageById, findMessageById };
