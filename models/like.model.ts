import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    episode: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    news: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Like = mongoose.models.Like || mongoose.model("Like", LikeSchema);

LikeSchema.index({ film: 1, user: 1 }, { unique: true });

export default Like;
