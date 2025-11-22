import { NotificationType } from "@/types";
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
      default: null,
    },
    episode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      default: null,
    },
    reviewReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    commentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },

    // isReadBy o'rniga:
    isRead: {
      type: Boolean,
      default: false,
    },

    isGlobal: {
      type: Boolean,
      default: false,
    },

    // Global notification uchun o'qilganlarni alohida collection'da saqlaymiz

    type: {
      type: String,
      enum: [
        NotificationType.SYSTEM,
        NotificationType.FILM,
        NotificationType.EPISODE,
        NotificationType.REVIEW_REPLY,
        NotificationType.COMMENT_REPLY,
        NotificationType.PRIVATE,
      ],
      default: NotificationType.PRIVATE,
    },
    link: {
      type: String,
      default: null,
    },
    batchId: {
      type: String,
      default: null,
      index: true, // Tez qidiruv uchun
    },
  },
  { timestamps: true }
);

// Index qo'shish
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ batchId: 1 }); // Batch bo'yicha qidirish uchun
NotificationSchema.index({ film: 1, batchId: 1 }); // Film + batch

const Notification =
  mongoose.models["Notification"] ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
