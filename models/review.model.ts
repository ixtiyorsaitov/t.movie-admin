import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    rating: { type: Number, min: 1, max: 10 },
    text: { type: String },
    reply: {
      type: {
        text: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        asAdmin: { type: Boolean, default: false },
      },
      required: false,
    },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
ReviewSchema.index({ film: 1, user: 1 }, { unique: true });
export default Review;
