"use server";

import { MemberType, MemberTypes } from "@/types";
import { connectToDatabase } from "@/lib/mongoose";
import mongoose from "mongoose";
import User from "@/models/user.model";
import Member from "@/models/member.model";

interface UpdateMemberParams {
  type: MemberType[];
  userId: string;
}

export async function createMemberAction({ userId, type }: UpdateMemberParams) {
  try {
    await connectToDatabase();

    // 🔎 1. Tekshirish: ma'lumotlar to'liq kiritilganmi
    if (!type || !Array.isArray(type) || type.length === 0) {
      return { error: "Kamida bitta rol tanlang" };
    }

    if (!userId) {
      return {
        error: "Foydalanuvchi ID kiritilmadi",
      };
    }

    // 🔎 2. Har bir type to‘g‘riligini tekshirish
    for (const memberType of type) {
      if (!MemberTypes.includes(memberType)) {
        return { error: `Noto‘g‘ri a’zolik turi: ${memberType}` };
      }
    }

    // 🔎 Avval ID formatini tekshiramiz
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { error: "Noto‘g‘ri foydalanuvchi ID format" };
    }

    // 🔎 3. User mavjudligini tekshirish
    const user = await User.findById(userId)
      .select("name email avatar role")
      .lean();
    if (!user) {
      return { error: "Foydalanuvchi topilmadi" };
    }

    const existingMember = await Member.findOne({ user: userId });
    if (existingMember) {
      return { error: "Bu foydalanuvchi uchun allaqachon hodimlik huquqi bor" };
    }

    const newMember = await Member.create({ user: userId, type });

    await newMember.populate("user", "name email avatar role");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newMember)),
    };
  } catch (error) {
    console.error("Xatolik:", error);
    return {
      success: false,
      error: "Xodim qo'shishda yoki yangilashda xatolik yuz berdi",
      status: 500,
    };
  }
}
