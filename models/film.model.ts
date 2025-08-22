import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["series", "movie"], default: "series" },
    rating: {
      avarage: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    meta: {
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    slug: { type: String, required: true, unique: true },
    published: Boolean,
    images: {
      image: {
        url: String,
        name: String,
      },
      backgroundImage: {
        url: String,
        name: String,
      },
      additionImage: [{ url: String, name: String }],
    },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    seasons: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Season" }],
      default: [],
      required: true,
    },
    video: {
      type: {
        url: { type: String },
        name: { type: String },
        resolution: {
          type: String,
          enum: ["360p", "480p", "720p", "1080p", "4k"],
          default: "720p",
        },
        size: String,
        duration: String,
      },
      required: false,
    },
  },
  { timestamps: true }
);

const Film = mongoose.models.Film || mongoose.model("Film", FilmSchema);

export default Film;
