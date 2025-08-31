import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    rating: { type: Number, min: 1, max: 10 },
    text: { type: String },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
CommentSchema.index({ film: 1, user: 1 }, { unique: true });
export default Comment;
