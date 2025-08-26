import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema(
  {
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Watchlist =
  mongoose.models.Watchlist || mongoose.model("Watchlist", WatchlistSchema);

export default Watchlist;
