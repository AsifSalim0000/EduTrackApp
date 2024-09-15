import mongoose from 'mongoose';
import BaseContent from './Content.js';

const quizContentSchema = new mongoose.Schema({
    questions: [{
        question: String,
        options: [String],
        correctAnswer: String,
    }],
});

const QuizContent = BaseContent.discriminator('quiz', quizContentSchema);

export default QuizContent;
