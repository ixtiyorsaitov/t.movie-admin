import { MemberType } from "@/types";
import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: [String],
      enum: [MemberType.ACTOR, MemberType.TRANSLATOR],
      required: true,
    },
  },
  { timestamps: true }
);

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);
export default Member;
