import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 10 },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
ReviewSchema.index({ film: 1, user: 1 }, { unique: true });
export default Review;
