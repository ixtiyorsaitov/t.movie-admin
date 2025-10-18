import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import "@/models/episode.model";
import { IFilm } from "@/types/film";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { CacheTags, generateSlug } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import Category from "@/models/category.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
) {
  try {
    await connectToDatabase();
    const { filmId } = await params;
    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return NextResponse.json(
        { error: "Film ID formati xato" },
        { status: 400 }
      );
    }
    const film = await Film.findById(filmId).populate("genres");
    if (!film) {
      return NextResponse.json({ error: "Film topilmadi" });
    }
    return NextResponse.json({ success: true, data: film }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; episodeId: string }> }
) {
  try {
    const { filmId } = await params;

    await connectToDatabase();

    const body = await req.json();
    const datas = body as IFilm;

    const genreDocs = await Promise.all(
      body.genres.map((g: string) => Genre.findById(g))
    );
    const selectedCtg = await Category.findById(datas.category);
    if (!selectedCtg) {
      return NextResponse.json(
        { error: "Kategoriya topilmadi" },
        { status: 400 }
      );
    }

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

    const slug = generateSlug(datas.title);
    const updatedFilm = await Film.findByIdAndUpdate(
      filmId,
      {
        title: datas.title,
        slug,
        description: datas.description,
        published: datas.published,
        genres: sortedGenres,
        category: selectedCtg._id,
        images: {
          image: {
            url: datas.images.image.url,
            name: datas.images.image.name,
          },
          backgroundImage: {
            url: datas.images.backgroundImage.url,
            name: datas.images.backgroundImage.name,
          },
          additionImage: datas.images.additionImages,
        },
      },
      { new: true }
    );

    if (!updatedFilm) {
      return NextResponse.json({
        error: "Film topilmadi",
      });
    }
    // revalidateTag(CacheTags.ANIME);
    // revalidateTag(`${CacheTags.ANIME}-${filmId}`);
    // revalidateTag(CacheTags.SLIDER);

    return NextResponse.json({ success: true, film: updatedFilm, form: datas });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
