import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags } from "@/lib/utils";
import Film from "@/models/film.model";
import "@/models/genre.model";
import Slider from "@/models/slider.model";
import { IFilm } from "@/types";
import mongoose from "mongoose";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    console.log("called api");

    const datas = await Slider.find().populate({
      path: "film",
      select: "title images.backgroundImage",
    });

    return NextResponse.json({ success: true, datas }, { status: 200 });
  } catch (error) {
    console.error("Error fetching carousel data:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    return adminOnly(async () => {
      try {
        await connectToDatabase();
        const body = await request.json();
        const { id } = body;

        if (!id) {
          return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
          );
        }

        // ❗ ID valid emasligini tekshirish
        if (!mongoose.isValidObjectId(id)) {
          return NextResponse.json(
            { error: "Invalid film ID format" },
            { status: 400 }
          );
        }

        const data = (await Film.findById(id)) as IFilm;

        if (!data) {
          return NextResponse.json(
            { error: "Film not found" },
            { status: 404 }
          );
        }

        const newSlider = await Slider.create({
          film: data._id,
        });

        revalidateTag(CacheTags.SLIDER);

        return NextResponse.json(
          { success: true, data: { ...newSlider.toObject(), film: data } },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error fetching slider data:", error);
        return NextResponse.json(
          { error: "Failed to fetch slider data" },
          { status: 500 }
        );
      }
    });
  } catch (error) {
    console.error("Error fetching slider data:", error);
    return NextResponse.json(
      { error: "Failed to fetch slider data" },
      { status: 500 }
    );
  }
}
