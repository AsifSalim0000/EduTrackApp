import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    trailer: {
        type: String,
        
    },
    description: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    contents: [
        {
            contentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BaseContent',
                required: true,
            },
            order: {
                type: Number,
                required: true,
            },
        }
    ],
    whatToTeach: [{
        type: String,

    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    price:{
        type:Number,
       
    },
    isLive:{
        type: Boolean,
        default: false,
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        
    },
});

export default mongoose.model('Course', courseSchema);
