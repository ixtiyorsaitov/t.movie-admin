import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Season from "@/models/season.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
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
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
) {
  try {
    await connectToDatabase();

    const { episodeId } = await params;

    const deleted = await Episode.findByIdAndDelete(episodeId);
    if (!deleted) {
      return NextResponse.json({ error: "Episode not found", success: false });
    }

    const season = await Season.findById(deleted.season);
    if (!season) {
      return NextResponse.json({ error: "Season not found", success: false });
    }

    // Remove episode from season.episodes array
    season.episodes = season.episodes.filter(
      (epId: string) => epId.toString() !== deleted._id.toString()
    );
    await season.save();

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
