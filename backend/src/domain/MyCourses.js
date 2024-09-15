import mongoose from 'mongoose';

const myCoursesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            },
            enrolledAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('MyCourses', myCoursesSchema);
