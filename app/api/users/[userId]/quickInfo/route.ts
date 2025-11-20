import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user.model";
import mongoose from "mongoose"; // <-- qo‘shiladi
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase();
    const { userId } = await params;

    // ❗ 1) Avval ID formatni tekshirish
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Noto‘g‘ri ID format" },
        { status: 400 }
      );
    }

    // ❗ 2) Shundan keyin DB so‘rovi
    const user = await User.findById(userId)
      .select("_id name email avatar")
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Foydalanuvchini olishda xatolik" },
      { status: 500 }
    );
  }
}
