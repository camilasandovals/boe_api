import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  message: {
    type: String,
    required: true,
    maxlength: 200
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const MessageModel = model('Message', MessageSchema);

export default MessageModel;