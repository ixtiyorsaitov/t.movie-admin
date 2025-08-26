import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import "@/models/season.model";
import "@/models/episode.model";
import { IFilm } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import mongoose from "mongoose";

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
    const film = await Film.findById(filmId).populate("genres seasons");
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

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

    const slug = slugify(datas.title, {
      lower: true,
      strict: true,
      remove: /['".,!?]/g,
    });
    const updatedFilm = await Film.findByIdAndUpdate(
      filmId,
      {
        title: datas.title,
        slug,
        description: datas.description,
        type: datas.type,
        published: datas.published,
        genres: sortedGenres,
        rating: {
          avarage: datas.rating.avarage,
          total: datas.rating.total,
          count: datas.rating.count,
        },
        meta: {
          likes: datas.meta.likes,
          watchList: datas.meta.watchList,
        },
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

    return NextResponse.json({ success: true, film: updatedFilm, form: datas });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
