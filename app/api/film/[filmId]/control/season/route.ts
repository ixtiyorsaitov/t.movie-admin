import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Season from "@/models/season.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { filmId: string } }
) {
  try {
    await connectToDatabase();

    const { filmId } = await params;
    const body = await req.json();
    const { title, number: seasonNumber } = body as {
      title: string;
      number: number;
    };

    if (!title || !seasonNumber) {
      return NextResponse.json({
        success: false,
        error: "Please enter all required fields!",
      });
    }

    const film = await Film.findById(filmId);
    if (!film) {
      return NextResponse.json({ success: false, error: "Film not found!" });
    }

    if (film.type === "movie") {
      return NextResponse.json({
        success: false,
        error: "Cannot add season to a movie type film.",
      });
    }

    const newSeason = await Season.create({
      title,
      seasonNumber,
      film: film._id,
    });

    film.seasons.push(newSeason._id);
    await film.save();

    return NextResponse.json({ success: true, data: newSeason });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
