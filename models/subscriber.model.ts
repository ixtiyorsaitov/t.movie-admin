import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    film: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
  },
  { timestamps: true }
);

const Subscriber =
  mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

SubscriberSchema.index({ user: 1, film: 1 }, { unique: true });

export default Subscriber;
