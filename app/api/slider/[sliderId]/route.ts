import { adminOnly } from "@/lib/admin-only";
import { CacheTags } from "@/lib/utils";
import Film from "@/models/film.model";
import Slider from "@/models/slider.model";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  try {
    return adminOnly(async () => {
      const { sliderId } = await params;
      const { filmId } = await req.json();

      if (!filmId) {
        return NextResponse.json(
          { error: "Film ID is required" },
          { status: 400 }
        );
      }
      const film = await Film.findById(filmId);
      if (!film) {
        return NextResponse.json({ error: "Film not found" }, { status: 404 });
      }

      const slider = await Slider.findByIdAndUpdate(
        sliderId,
        {
          film: film._id,
        },
        {
          new: true,
        }
      );
      if (!slider) {
        return NextResponse.json(
          { error: "Slider not found" },
          { status: 404 }
        );
      }
      revalidateTag(CacheTags.SLIDER);

      return NextResponse.json(
        { success: true, data: { ...slider.toObject(), film } },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error("Error update slider data:", error);
    return NextResponse.json(
      { error: "Failed to update slider data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  try {
    return adminOnly(async () => {
      const { sliderId } = await params;

      const slider = await Slider.findByIdAndDelete(sliderId);
      if (!slider) {
        return NextResponse.json(
          { error: "Slider not found" },
          { status: 404 }
        );
      }
      revalidateTag(CacheTags.SLIDER);

      return NextResponse.json(
        { success: true, message: "Slider deleted successfully", data: slider },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error("Error deleting slider:", error);
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}
