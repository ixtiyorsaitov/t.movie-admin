import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags, generateSlug } from "@/lib/utils";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import { IGenre } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ genreId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { genreId } = await params;
      const body = await req.json();
      const data = body as IGenre;
      if (!data.name) {
        return NextResponse.json({
          error: "Iltimos janr nomini kiriting",
        });
      }
      const slug = generateSlug(data.name);
      const updatedGenre = await Genre.findByIdAndUpdate(
        genreId,
        {
          name: data.name,
          slug,
        },
        { new: true }
      );
      if (!updatedGenre) {
        return NextResponse.json({ error: "Janr topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updatedGenre });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ genreId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { genreId } = await params;

      const genre = await Genre.findById(genreId);
      if (!genre) {
        return NextResponse.json({ error: "Janr topilmadi" }, { status: 404 });
      }

      await Film.updateMany(
        { genres: genreId },
        { $pull: { genres: genreId } }
      );

      await Genre.findByIdAndDelete(genreId);
      return NextResponse.json({
        success: true,
        message: "Genre deleted and removed from films",
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
