import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    seasonNumber: { type: Number, required: true },
    title: String,
    description: String,
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film", required: true },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
  },
  { timestamps: true }
);

const Season = mongoose.models.Season || mongoose.model("Season", SeasonSchema);

export default Season;
