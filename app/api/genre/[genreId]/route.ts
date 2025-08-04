import { connectToDatabase } from "@/lib/mongoose";
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
    const updatedGenre = await Genre.findByIdAndUpdate(genreId, {
      name: data.name,
      slug,
    });
    return NextResponse.json({ success: true, data: updatedGenre });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
