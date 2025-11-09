import { FilmType } from "@/types";
import { IFilm } from "@/types/film";
import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema<IFilm>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: [FilmType.SERIES, FilmType.MOVIE],
      default: FilmType.SERIES,
    },
    rating: {
      average: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    episodes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Episode", default: [] },
    ],
    actors: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: [] },
    ],
    translators: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: [] },
    ],
    disableComments: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Film = mongoose.models.Film || mongoose.model<IFilm>("Film", FilmSchema);

export default Film;
