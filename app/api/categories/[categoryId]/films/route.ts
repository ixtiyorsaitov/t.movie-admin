import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await connectToDatabase();
    const { categoryId } = await params;

    const films = await Film.find({ category: categoryId })
      .select("title")
      .lean();

    return NextResponse.json({ success: true, datas: films });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
