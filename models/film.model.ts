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
  },
  { timestamps: true }
);

const Film = mongoose.models.Film || mongoose.model("Film", FilmSchema);

export default Film;
