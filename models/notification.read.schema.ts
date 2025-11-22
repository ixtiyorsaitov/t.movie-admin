import mongoose from "mongoose";

// NotificationRead.js - Alohida collection
const NotificationReadSchema = new mongoose.Schema({
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index - tez qidiruv uchun
NotificationReadSchema.index({ notification: 1, user: 1 }, { unique: true });
NotificationReadSchema.index({ user: 1, readAt: -1 });

const NotificationRead =
  mongoose.models["NotificationRead"] ||
  mongoose.model("NotificationRead", NotificationReadSchema);

export default NotificationRead;
