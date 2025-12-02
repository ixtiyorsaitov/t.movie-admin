import mongoose from "mongoose";

const UserNotificationSchema = new mongoose.Schema({
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
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index - tez qidiruv uchun
UserNotificationSchema.index({ notification: 1, user: 1 }, { unique: true });
UserNotificationSchema.index({ user: 1, readAt: -1 });

const UserNotification =
  mongoose.models["UserNotification"] ||
  mongoose.model("UserNotification", UserNotificationSchema);

export default UserNotification;
