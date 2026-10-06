import mongoose from 'mongoose';
import './Order.js';

const ReplySchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['customer', 'admin'],
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    senderType: {
      type: String,
      enum: ['guest', 'customer'],
      default: 'customer',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
    readByAdmin: {
      type: Boolean,
      default: false,
    },
    readByCustomer: {
      type: Boolean,
      default: true,
    },
    replies: {
      type: [ReplySchema],
      default: [],
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Message) {
  delete mongoose.models.Message;
}

export default mongoose.model('Message', MessageSchema);
