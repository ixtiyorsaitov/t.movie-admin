import { NotificationSendingType, NotificationType } from "@/types";
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
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
      default: NotificationType.SYSTEM,
    },

    sending: {
      type: {
        type: String,
        enum: [
          NotificationSendingType.ALL,
          NotificationSendingType.USER,
          NotificationSendingType.FILM_SUBSCRIBERS,
          // NotificationSendingType.SELECTED_USERS,
        ],
        default: NotificationSendingType.ALL,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      film: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film",
        default: null,
      },
    },
    link: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models["Notification"] ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
