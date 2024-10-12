import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
      required: true
     },
  courseId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
       required: true },
  completedLessons: [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'BaseContent' 
    }], 
  currentLesson: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'BaseContent' 
    }, 
  progress: { 
    type: Number,
    default: 0 },
  playtime: { 
    type: Number,
     default: 0 }, 
  updatedAt: { 
    type: Date,
    default: Date.now }, 
});

export default mongoose.model('CourseProgress', courseProgressSchema);
