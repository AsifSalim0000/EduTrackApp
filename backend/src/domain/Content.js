import mongoose from 'mongoose';

const baseContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'video', 'quiz'], 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { discriminatorKey: 'type', collection: 'contents' });

const BaseContent = mongoose.model('BaseContent', baseContentSchema);

export default BaseContent;
