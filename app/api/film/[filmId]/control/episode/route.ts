import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Season from "@/models/season.model";
import { ISeason } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { filmId: string } }
) {
  try {
    await connectToDatabase();
    const datas = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const seasonId = searchParams.get("season");
    if (!seasonId) {
      return NextResponse.json({
        error: "Season id is required",
        success: false,
      });
    }
    const season = await Season.findById(seasonId).populate("episodes");
    if (!season) {
      return NextResponse.json({ error: "Season not found", success: false });
    }
    const newEpisode = await Episode.create({ ...datas, season: season._id });
    season.episodes.push(newEpisode._id);
    await season.save();
    return NextResponse.json({ success: true, data: newEpisode });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;

    const seasonId = searchParams.get("season");
    if (!seasonId) {
      return NextResponse.json({
        error: "Season id is required",
        success: false,
      });
    }
    const season = await Season.findById(seasonId).populate("episodes");
    if (!season) {
      return NextResponse.json({ error: "Season not found", success: false });
    }
    return NextResponse.json(season.episodes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
