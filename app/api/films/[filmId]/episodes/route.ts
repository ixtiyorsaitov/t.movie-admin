import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Film from "@/models/film.model";
import { IEpisode } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const body = await req.json();
      const { filmId } = await params;
      console.log(filmId);

      const film = await Film.findById(filmId);

      if (!film) {
        return NextResponse.json({
          error: "Film topilmadi",
        });
      }
      const { title, description, episodeNumber, video } = body as IEpisode;
      if (!title || !description || !episodeNumber || !video) {
        return NextResponse.json({
          error: "Ma'lumotlarni to'liq kiriting",
        });
      }
      const datas = {
        title,
        description,
        episodeNumber,
        video,
        film: film._id,
      };
      const newEpisode = await Episode.create(datas);
      return NextResponse.json({ success: true, data: newEpisode });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
