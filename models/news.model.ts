import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: String,
      name: String,
    },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    // expireAt: { type: Date, default: null, expires: 0 },
  },
  { timestamps: true }
);

const News = mongoose.models.News || mongoose.model("News", NewsSchema);

export default News;
