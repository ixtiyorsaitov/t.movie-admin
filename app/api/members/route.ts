import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Member from "@/models/member.model";
import User from "@/models/user.model";
import { IResponse, MemberType, MemberTypes, ROLE } from "@/types";
import { IMember } from "@/types/member";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const members = (await Member.find({})
      .populate({
        path: "user",
        select: "name email avatar",
      })
      .skip(skip)
      .limit(limit)) as IMember[];

    return NextResponse.json<IResponse<IMember>>({
      success: true,
      datas: members,
      pagination: {
        total: await Member.countDocuments({}),
        page,
        limit,
        totalPages: Math.ceil((await Member.countDocuments({})) / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Xodimlarlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();

      // 🔒 Faqat SUPERADMIN
      if (admin.role !== ROLE.SUPERADMIN) {
        return NextResponse.json(
          { error: "Sizga bu amalni bajarish mumkin emas" },
          { status: 403 }
        );
      }

      const body = await req.json();
      const { type, userId } = body as { type: MemberType[]; userId: string };

      // 🔎 1. Tekshirish: ma'lumotlar to'liq kiritilganmi
      if (!type || !Array.isArray(type) || type.length === 0) {
        return NextResponse.json(
          { error: "Kamida bitta rol tanlang" },
          { status: 400 }
        );
      }
      if (!userId) {
        return NextResponse.json(
          { error: "Foydalanuvchi ID kiritilmadi" },
          { status: 400 }
        );
      }

      // 🔎 2. Har bir type to‘g‘riligini tekshirish
      for (const memberType of type) {
        if (!MemberTypes.includes(memberType)) {
          return NextResponse.json(
            { error: `Noto‘g‘ri a’zolik turi: ${memberType}` },
            { status: 400 }
          );
        }
      }

      // 🔎 Avval ID formatini tekshiramiz
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { error: "Noto‘g‘ri foydalanuvchi ID format" },
          { status: 400 }
        );
      }

      // 🔎 3. User mavjudligini tekshirish
      const user = await User.findById(userId).lean();
      if (!user) {
        return NextResponse.json(
          { error: "Foydalanuvchi topilmadi" },
          { status: 404 }
        );
      }

      // 🧩 4. Mavjud memberni topish
      let member = await Member.findOne({ user: userId });

      if (member) {
        // ✅ Agar mavjud bo‘lsa — eski `type` ni o‘chirib, yangisini yozamiz
        member.type = type;
        await member.save();
        await member.populate("user");
      } else {
        // ✅ Agar yo‘q bo‘lsa — yangi yaratamiz
        member = await Member.create({ user: userId, type });
        await member.populate("user");
      }

      // 🔁 5. Natija
      return NextResponse.json({
        success: true,
        data: member,
      });
    } catch (error) {
      console.error("Xatolik:", error);
      return NextResponse.json(
        { error: "Xodim qo'shishda yoki yangilashda xatolik yuz berdi" },
        { status: 500 }
      );
    }
  });
}
