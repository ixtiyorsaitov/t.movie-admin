import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Episode from "@/models/episode.model";
import Film from "@/models/film.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const datas = await req.json();
      const { episodeId, filmId } = await params;

      if (
        !mongoose.Types.ObjectId.isValid(episodeId) ||
        !mongoose.Types.ObjectId.isValid(filmId)
      ) {
        return NextResponse.json(
          { error: "Noto'g'ri ID format" },
          { status: 400 }
        );
      }

      // Mass assignment'ni oldini olish — faqat ruxsat etilgan maydonlarni olamiz
      const { title, description, episodeNumber, video } = datas as {
        title?: string;
        description?: string;
        episodeNumber?: number;
        video?: unknown;
      };

      const episode = await Episode.findByIdAndUpdate(
        episodeId,
        {
          title,
          description,
          episodeNumber,
          video,
        },
        { new: true, runValidators: true }
      );
      if (!episode) {
        return NextResponse.json({ error: "Epizod topilmadi" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: episode }, { status: 200 });
    } catch (error) {
      console.error("PUT error:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  });
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      const { episodeId, filmId } = await params;

      if (
        !mongoose.Types.ObjectId.isValid(episodeId) ||
        !mongoose.Types.ObjectId.isValid(filmId)
      ) {
        return NextResponse.json(
          { error: "Noto'g'ri ID format" },
          { status: 400 }
        );
      }

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
  });
}
