"use server";

import { MemberType, MemberTypes } from "@/types";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user.model";
import Member from "@/models/member.model";

interface UpdateMemberParams {
  type: MemberType[];
  userId: string;
  memberId: string;
}

export async function updateMemberAction({
  userId,
  type,
  memberId,
}: UpdateMemberParams) {
  try {
    await connectToDatabase();

    // 🔎 2. Validatsiyalar
    if (!type || !Array.isArray(type) || type.length === 0) {
      return { success: false, error: "Kamida bitta rol tanlang" };
    }

    if (!userId) {
      return { success: false, error: "Foydalanuvchi ID kiritilmadi" };
    }

    if (!memberId) {
      return { success: false, error: "Hodim ID kiritilmadi" };
    }

    // 🔎 3. Type validatsiyasi
    for (const t of type) {
      if (!MemberTypes.includes(t)) {
        return { success: false, error: `Noto‘g‘ri a’zolik turi: ${t}` };
      }
    }

    // 🔎 4. ObjectId validatsiyasi
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, error: "Noto‘g‘ri foydalanuvchi ID format" };
    }

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return { success: false, error: "Noto‘g‘ri hodim ID format" };
    }

    // 🔎 5. User mavjudmi?
    const user = await User.findById(userId).lean();
    if (!user) {
      return { success: false, error: "Foydalanuvchi topilmadi" };
    }

    // 🔎 6. Member mavjudmi?
    const member = await Member.findById(memberId);
    if (!member) {
      return { success: false, error: "Hodim topilmadi" };
    }

    // 🔎 7. Agar boshqa member shu userga tegishli bo'lsa — xato
    const anotherMember = await Member.findOne({
      user: userId,
      _id: { $ne: memberId },
    });

    if (anotherMember) {
      return {
        success: false,
        error: "Bu foydalanuvchi uchun allaqachon hodimlik mavjud",
      };
    }

    // 🧩 8. Yangilash
    member.user = userId;
    member.type = type;

    await member.save();
    await member.populate("user", "name email avatar role");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(member)),
    };
  } catch (error) {
    console.error("Xatolik:", error);
    return {
      success: false,
      error: "Hodimni yangilashda xatolik yuz berdi",
      status: 500,
    };
  }
}
