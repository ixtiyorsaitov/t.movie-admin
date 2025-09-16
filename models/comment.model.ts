import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    content: { type: String, required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;
