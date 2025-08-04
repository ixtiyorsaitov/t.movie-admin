import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import { IGenre } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ genreId: string }> }
) {
  try {
    await connectToDatabase();
    const { genreId } = await params;
    const body = await req.json();
    const data = body as IGenre;
    if (!data.name) {
      return NextResponse.json({
        success: false,
        error: "Please enter the genre's name",
      });
    }
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
      remove: /['".,!?]/g,
    });
    const updatedGenre = await Genre.findByIdAndUpdate(
      genreId,
      {
        name: data.name,
        slug,
      },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedGenre });
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
  { params }: { params: Promise<{ genreId: string }> }
) {
  try {
    await connectToDatabase();
    const { genreId } = await params;

    // 1. Genre mavjudligini tekshirish
    const genre = await Genre.findById(genreId);
    if (!genre) {
      return NextResponse.json(
        { success: false, message: "Genre not found" },
        { status: 404 }
      );
    }

    // 2. Film.lardagi genres array ichidan shu ID ni olib tashlash
    await Film.updateMany({ genres: genreId }, { $pull: { genres: genreId } });

    // 3. Genre ni o‘chirish
    await Genre.findByIdAndDelete(genreId);

    return NextResponse.json({
      success: true,
      message: "Genre deleted and removed from films",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
