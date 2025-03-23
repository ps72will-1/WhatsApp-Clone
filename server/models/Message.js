// server/models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    attachments: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'audio', 'document', 'location', 'contact'],
        },
        url: String,
        name: String,
        size: Number,
        mimetype: String,
        duration: Number, // For audio/video
        thumbnail: String, // For video
        latitude: Number, // For location
        longitude: Number, // For location
        contactInfo: {
          name: String,
          phone: String,
          email: String,
        },
      },
    ],
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', MessageSchema);