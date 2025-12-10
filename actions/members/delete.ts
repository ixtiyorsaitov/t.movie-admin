"use server";

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import Member from "@/models/member.model";
import Film from "@/models/film.model";

type DeleteMemberParams = string;

export async function deleteMemberAction(memberId: DeleteMemberParams) {
  try {
    await connectToDatabase();

    // 1️⃣ Tekshirish
    if (!memberId) {
      return { success: false, error: "Hodim ID kiritilmadi" };
    }
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return { success: false, error: "Noto‘g‘ri hodim ID format" };
    }

    // 2️⃣ Hodim mavjudligini tekshirish
    const member = await Member.findById(memberId);
    if (!member) {
      return { success: false, error: "Hodim topilmadi" };
    }

    // 3️⃣ Film ichidan o'chirish (actors va translators)
    await Film.updateMany(
      {
        $or: [{ actors: memberId }, { translators: memberId }],
      },
      {
        $pull: {
          actors: memberId,
          translators: memberId,
        },
      }
    );

    // 4️⃣ Member’ning o‘zini o‘chirish
    await Member.findByIdAndDelete(memberId);

    return {
      success: true,
      message: "Hodim muvafaqqiyatli o‘chirildi",
    };
  } catch (error) {
    console.error("Xatolik:", error);
    return {
      success: false,
      error: "Hodimni o‘chirishda xatolik yuz berdi",
    };
  }
}
