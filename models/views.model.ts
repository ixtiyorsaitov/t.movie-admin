import mongoose from "mongoose";

const ViewSchema = new mongoose.Schema(
  {
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    episode: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
    news: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const View = mongoose.models.View || mongoose.model("View", ViewSchema);

export default View;

ViewSchema.index({ film: 1, user: 1 }, { unique: true });
