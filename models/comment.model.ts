import { IComment } from "@/types/comment";
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema<IComment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    content: { type: String, required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    reply: {
      type: {
        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        asAdmin: { type: Boolean, default: false },
      },
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
export default Comment;
