import { NotificationType } from "@/types";
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film", default: null },
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

    isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    isGlobal: { type: Boolean, default: false },

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

    link: { type: String, default: null }, // Masalan: "/film/123"
  },
  { timestamps: true }
);

const Notification =
  mongoose.models["Notification"] ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
