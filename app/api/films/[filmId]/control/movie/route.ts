import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import { IVideo } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
) {
  try {
    await connectToDatabase();
    const { filmId } = await params;
    const body = await req.json();
    const data = body as IVideo;
    const updated = await Film.findByIdAndUpdate(
      filmId,
      { video: { ...data } },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Film not found" });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
