import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
) {
  try {
    await connectToDatabase();
    const { filmId } = await params;

    // ❗ 1) Avval ID formatni tekshirish
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return NextResponse.json(
        { error: "Noto‘g‘ri ID format" },
        { status: 400 }
      );
    }

    // ❗ 2) Shundan keyin DB so‘rovi
    const film = await Film.findById(filmId)
      .select("_id title images.image rating.average")
      .lean();

    if (!film) {
      return NextResponse.json({ error: "Film topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ data: film, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Film ishlashda xatolik" },
      { status: 500 }
    );
  }
}
