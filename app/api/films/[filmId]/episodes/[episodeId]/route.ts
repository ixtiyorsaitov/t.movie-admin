import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Film from "@/models/film.model";
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
      return NextResponse.json({ error: "Epizod topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: episode }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
) {
  try {
    await connectToDatabase();

    const { episodeId, filmId } = await params;

    const deleted = await Episode.findByIdAndDelete(episodeId);
    if (!deleted) {
      return NextResponse.json({ error: "Epizod topilmadi" }, { status: 404 });
    }
    await Film.findByIdAndUpdate(filmId, {
      $pull: { episodes: episodeId },
    });

    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Server xatosi" }, { status: 500 });
  }
}
