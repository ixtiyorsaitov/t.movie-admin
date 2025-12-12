import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { generateSlug } from "@/lib/utils";
import Genre from "@/models/genre.model";
import { IGenre } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const body = await req.json();
      const data = body as IGenre;
      if (!data.name) {
        return NextResponse.json(
          {
            error: "Iltimos janr nomini kiriting",
          },
          { status: 400 }
        );
      }
      const slug = generateSlug(data.name);
      const existing = await Genre.findOne({ slug });
      if (existing) {
        return NextResponse.json(
          {
            error: "Bu janr allaqachon mavjud.",
          },
          { status: 400 }
        );
      }
      const newGenre = await Genre.create({
        name: data.name,
        slug,
      });
      return NextResponse.json(
        { success: true, data: newGenre },
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}

export async function GET() {
  try {
    await connectToDatabase();
    const genres = await Genre.find();

    return NextResponse.json({ datas: genres, success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
