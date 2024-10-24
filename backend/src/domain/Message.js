import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {type:String, default: "text", required: true },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replyTo:{ type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;