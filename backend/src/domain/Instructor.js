import mongoose from 'mongoose';

const InstructorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    qualifications: {
        type: [String], 
        required: true,
    },
    description: {
        type: [String], 
        required: true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

export default mongoose.model('Instructor', InstructorSchema);
