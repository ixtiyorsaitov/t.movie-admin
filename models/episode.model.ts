import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    video: {
      url: { type: String, required: true },
      resolution: {
        type: String,
        enum: ["360p", "480p", "720p", "1080p", "4k"],
        default: "720p",
      },
      name: { type: String, required: true },
      size: String,
      duration: String,
    },
    episodeNumber: { type: Number, required: true },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
  },
  { timestamps: true }
);

const Episode =
  mongoose.models.Episode || mongoose.model("Episode", EpisodeSchema);

export default Episode;
