import asyncHandler from 'express-async-handler';
import { sendMessageUseCase, getMessagesUseCase, fetchMyTeachersUseCase, fetchStudentsForInstructor, deleteMessage } from '../usecases/MessageUseCases.js';
import { HttpStatus } from '../utils/HttpStatus.js';

const sendMessage = asyncHandler(async (req, res) => {
  const { content, receiverId,type,replyTo } = req.body;

  const userId = req.user._id;

  try {
    const message = await sendMessageUseCase(userId, content,type,replyTo, receiverId);
    res.status(HttpStatus.CREATED).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send message', error });
  }
});

const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { receiverId } = req.query;

  try {
    const messages = await getMessagesUseCase(userId, receiverId);
    res.status(HttpStatus.OK).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch messages', error });
  }
});

const fetchMyTeachers = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const instructors = await fetchMyTeachersUseCase(userId);

    res.status(HttpStatus.OK).json(instructors);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch teachers', error });
  }
});

const getStudentsByInstructor = async (req, res) => {
  try {
    const instructorId = req.user.id;  
    const students = await fetchStudentsForInstructor(instructorId);
    
    res.status(HttpStatus.OK).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};
const deleteMessageController = async (req, res) => {
  const { messageId } = req.params;

  try {
    await deleteMessage(messageId);
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const sendAudio= async (req,res) => {
  if (!req.file) {
    return res.status(400).send('No audio file uploaded.');
  }
  res.status(200).send({
    message: 'Audio file uploaded successfully',
    fileUrl: req.file.location,
  });
}
export { sendMessage, getMessages, fetchMyTeachers,getStudentsByInstructor,deleteMessageController,sendAudio };
