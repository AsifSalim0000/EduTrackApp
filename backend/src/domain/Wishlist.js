import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema({
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
            }
        }
    ],
    lastAccessed: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Wishlist', WishlistSchema);
