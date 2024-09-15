import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    profileImage:{
        type: String,
        default: ''
    },
    title:{
        type:String,
        default:"Student"
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Student", "Instructor"],
        default: "Student"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
      },
    status: {
        type:String,
        default: "active"
    },
      plan: {
        type: String,
        default: "None",
      },

});

export default mongoose.model('User', UserSchema);
