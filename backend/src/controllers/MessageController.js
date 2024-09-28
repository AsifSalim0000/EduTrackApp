import MyCourses from '../domain/MyCourses.js';  // Assuming the file path
import User from '../domain/User.js';            // Assuming the file path
import Course from '../domain/Course.js';        // Assuming the file path
import Instructor from '../domain/Instructor.js';// Assuming the file path
// messageController.js
import Message from '../domain/Message.js';
import Chat from '../domain/Chat.js';

const fetchMyTeachers = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated and req.user contains the user's info
    console.log("User ID: ", userId);

    // Find all courses the student is enrolled in
    const myCourses = await MyCourses.findOne({ userId })
      .populate({
        path: 'courses.courseId',
        select: 'instructor', // Populate the instructor from the course
        populate: {
          path: 'instructor', // Get the instructor (User) from Course
          model: 'User',
          select: '_id username profileImage email title', // Selecting only required fields from User
        },
      });

    if (!myCourses || myCourses.courses.length === 0) {
      return res.status(404).json({ message: 'No courses found or no teachers assigned.' });
    }

    // Get the instructor's user IDs from the populated data
    const instructorUserIds = myCourses.courses.map(course => course.courseId.instructor._id);

    // Now find all instructor details using the userId from the Instructor schema
    const instructors = await Instructor.find({ userId: { $in: instructorUserIds } })
      .populate({
        path: 'userId', // Populate the user details from the User schema
        model: 'User',
        select: '_id username profileImage email title', // Fields to pass to the frontend
      });

    if (instructors.length === 0) {
      return res.status(404).json({ message: 'No instructors found for these courses.' });
    }

    // Send the populated instructor details to the frontend
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Failed to fetch teachers. Please try again later.' });
  }
};

const sendMessage = async (req, res) => {
  const { content, instructorId } = req.body;  // Remove chatId since we are searching based on users
  const userId = req.user._id;  // Get the logged-in user's ID

  if (!content || !instructorId) {
    return res.status(400).json({ message: 'Invalid data: content or instructorId missing' });
  }

  try {
    // Find if a chat exists between the user and the instructor
    let chat = await Chat.findOne({
      users: { $all: [userId, instructorId] }  // Ensure both user and instructor are in the chat
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = await Chat.create({
        users: [userId, instructorId],  // Add both the sender (student) and the instructor
      });
    }

    // Create a new message
    const newMessage = await Message.create({
      sender: userId,  // The logged-in user sending the message
      content,
      chat: chat._id,
    });

    // Update the latest message in the chat
    chat.latestMessage = newMessage._id;
    await chat.save();

    // Get the full message with populated fields (sender info and chat)
    const fullMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username profileImage')  // Populate sender's username and profile image
      .populate('chat');

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error });
  }
};


const getMessages = async (req, res) => {
  const userId = req.user._id;     // Get the logged-in user's ID
  const { instructorId } = req.query;  // Get instructorId from query params

  console.log(`User ID: ${userId}, Instructor ID: ${instructorId}`);

  try {
    // Find the chat where both the user and the instructor are participants
    const chat = await Chat.findOne({
      users: { $all: [userId, instructorId] }  // Ensure both user and instructor are in the chat
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found or you are not a participant in this chat.' });
    }

    // Fetch all messages related to the chat, sorted by creation time
    const messages = await Message.find({ chat: chat._id })
      .populate('sender', 'username profileImage')  // Populate sender's username and profile image
      .sort({ createdAt: 1 });  // Sort messages chronologically (oldest first)

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};



export { fetchMyTeachers, sendMessage, getMessages }
