import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Film from "@/models/film.model";
import Season from "@/models/season.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; seasonId: string }> }
) {
  try {
    await connectToDatabase();
    const { seasonId } = await params;
    const body = await req.json();
    const { title, number: seasonNumber } = body as {
      title: string;
      number: number;
    };
    const season = await Season.findByIdAndUpdate(
      seasonId,
      {
        title,
        seasonNumber,
      },
      { new: true }
    );
    if (!season) {
      return NextResponse.json({ error: "Season not found", success: false });
    }

    return NextResponse.json({ success: true, data: season });
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
  { params }: { params: Promise<{ filmId: string; seasonId: string }> }
) {
  try {
    await connectToDatabase();
    const { filmId, seasonId } = await params;

    // 1. Season mavjudligini tekshirish
    const season = await Season.findById(seasonId);
    if (!season) {
      return NextResponse.json({ error: "Season not found", success: false });
    }

    // 2. Shu season ga tegishli barcha episodeni o‘chirish
    await Episode.deleteMany({ season: seasonId });

    // 3. Season’ni o‘chirish
    await Season.findByIdAndDelete(seasonId);

    // 4. Film documentdan ushbu season IDni olib tashlash
    await Film.findByIdAndUpdate(filmId, {
      $pull: { seasons: seasonId },
    });

    return NextResponse.json({
      success: true,
      message: "Season and related episodes deleted, film updated",
    });
  } catch (error) {
    console.error("DELETE season error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
