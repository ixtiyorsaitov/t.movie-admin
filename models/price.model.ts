import { PeriodType } from "@/types";
import { IPrice } from "@/types/price";
import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema<IPrice>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    period: {
      type: String,
      required: true,
      enum: [PeriodType.MONTHLY, PeriodType.YEARLY],
      default: PeriodType.MONTHLY,
    },
    expiresPeriodCount: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: { text: String, included: Boolean } }],
    buttonText: { type: String, required: true, default: "Sotib olish" },
    buttonVariant: {
      type: String,
      required: true,
      default: "default",
      enum: ["default", "outline", "secondary"],
    },
    recommended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Price =
  mongoose.models.Price || mongoose.model<IPrice>("Price", PriceSchema);

export default Price;
