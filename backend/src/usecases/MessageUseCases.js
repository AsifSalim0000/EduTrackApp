
import { findChat, createChat, createMessage, findMessages, findCoursesByUser, findInstructorsByUserIds, getStudentsByInstructorId } from '../repositories/MessageRepository.js';

const sendMessageUseCase = async (userId, content, receiverId) => {
  let chat = await findChat(userId, receiverId);

  if (!chat) {
    chat = await createChat([userId, receiverId]);
  }

  // Create and save a new message
  const newMessage = await createMessage(userId, content, chat._id);

  // Update the latest message in the chat
  chat.latestMessage = newMessage._id;
  await chat.save();

  // Return the populated message
  return newMessage;
};

// Use case for getting messages in a chat
const getMessagesUseCase = async (userId, receiverId) => {
  const chat = await findChat(userId, receiverId);

  if (!chat) {
    throw new Error('Chat not found or you are not a participant in this chat.');
  }

  // Fetch messages for the chat
  return await findMessages(chat._id);
};

// Use case for fetching teachers
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

export { sendMessageUseCase, getMessagesUseCase, fetchMyTeachersUseCase,fetchStudentsForInstructor };
