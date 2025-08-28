import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Film from "@/models/film.model";
import { IEpisode } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
) {
  try {
    await connectToDatabase();
    const { filmId } = await params;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const film = await Film.findById(filmId);
    if (!film) {
      return NextResponse.json({ error: "Film topilmadi" }, { status: 404 });
    }

    const query: Record<string, unknown> = { film: film._id };
    if (search) {
      query["title"] = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const [episodes, total] = await Promise.all([
      Episode.find(query).skip(skip).limit(limit).sort({ episodeNumber: -1 }),
      Episode.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        datas: episodes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        film,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

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
      film.episodes.push(newEpisode._id);
      await film.save();
      return NextResponse.json({ success: true, data: newEpisode });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
