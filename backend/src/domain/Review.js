import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', 
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, 
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Review', reviewSchema);
