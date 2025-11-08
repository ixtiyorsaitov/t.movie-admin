import { ROLE } from "@/types";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    // meta: {
    //   likes: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: "Film",
    //     default: [],
    //   },
    //   watchList: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: "Film",
    //     default: [],
    //   },
    //   submitList: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: "Film",
    //     default: [],
    //   },
    // },
    role: {
      type: String,
      enum: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
      required: true,
      default: ROLE.USER,
    },
    phone: String,
  },
  { timestamps: true, strict: true }
);

const User = mongoose.models["User"] || mongoose.model("User", UserSchema);

export default User;
