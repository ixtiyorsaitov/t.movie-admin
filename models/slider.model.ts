import mongoose from "mongoose";

const SliderSchema = new mongoose.Schema(
  {
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
      required: true,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.models.Slider || mongoose.model("Slider", SliderSchema);

export default Slider;
