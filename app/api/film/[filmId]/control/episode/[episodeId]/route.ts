import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Season from "@/models/season.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { filmId: string; episodeId: string } }
) {
  try {
    await connectToDatabase();
    const datas = await req.json();
    const { episodeId } = await params;
    const episode = await Episode.findByIdAndUpdate(episodeId, datas, {
      new: true,
    });
    if (!episode) {
      return NextResponse.json({ success: false, error: "Episode not found" });
    }

    return NextResponse.json({ success: true, data: episode });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
