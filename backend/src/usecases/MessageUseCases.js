
import { findChat, createChat, createMessage, findMessages, findCoursesByUser, findInstructorsByUserIds, getStudentsByInstructorId, findMessageById, deleteMessageById } from '../repositories/MessageRepository.js';

const sendMessageUseCase = async (userId, content,type,replyTo,receiverId) => {
  let chat = await findChat(userId, receiverId);

  if (!chat) {
    chat = await createChat([userId, receiverId]);
  }

  const newMessage = await createMessage(userId, content,type,replyTo, chat._id);

  chat.latestMessage = newMessage._id;
  await chat.save();

  return newMessage;
};

const getMessagesUseCase = async (userId, receiverId) => {
  const chat = await findChat(userId, receiverId);

  if (!chat) {
    throw new Error('Chat not found or you are not a participant in this chat.');
  }

  return await findMessages(chat._id);
};

const fetchMyTeachersUseCase = async (userId) => {
  const myCourses = await findCoursesByUser(userId);

  if (!myCourses || myCourses.courses.length === 0) {
    throw new Error('No courses found or no teachers assigned.');
  }

  const instructorUserIds = myCourses.courses.map(course => course.courseId.instructor._id);
  return await findInstructorsByUserIds(instructorUserIds);
};
const fetchStudentsForInstructor = async (instructorId) => {
  try {
    const students = await getStudentsByInstructorId(instructorId);
    console.log(students);
    
    return students;
  } catch (error) {
    throw new Error('Failed to retrieve students for the instructor');
  }
};
const deleteMessage = async (messageId) => {
  
  const message = await findMessageById(messageId);
  if (!message) {
    throw new Error('Message not found');
  }

  return await deleteMessageById(messageId);
};

export { sendMessageUseCase, getMessagesUseCase, fetchMyTeachersUseCase,fetchStudentsForInstructor, deleteMessage };
