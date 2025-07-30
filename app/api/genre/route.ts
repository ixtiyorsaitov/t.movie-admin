import { connectToDatabase } from "@/lib/mongoose";
import Genre from "@/models/genre.model";
import { IGenre } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
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
      strict: true, // faqat a-z va 0-9 qoldiradi
      remove: /['".,!?]/g, // qo‘shimcha belgilarni olib tashlaydi
    });
    const newGenre = await Genre.create({
      name: data.name,
      slug,
    });
    return NextResponse.json({ success: true, data: newGenre });
  } catch (error) {
    console.error(error);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const genres = await Genre.find();
    return NextResponse.json(genres);
  } catch (error) {
    console.error(error);
  }
}
