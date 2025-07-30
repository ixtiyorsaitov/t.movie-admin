import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import { IFilm } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(
  req: NextRequest,
  { params }: { params: { filmId: string } }
) {
  try {
    await connectToDatabase();
    const { filmId } = params;
    const film = await Film.findById(filmId);

    return NextResponse.json(film ? film : null);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { filmId: string } }
) {
  try {
    const { filmId } = await params;
    console.log(filmId);

    await connectToDatabase();

    const body = await req.json();
    const datas = body as IFilm;

    // Genrelarni to'g'ri yig'ish
    const genreDocs = await Promise.all(
      body.genres.map((g: string) => Genre.findById(g))
    );

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

    // Slug yaratish
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
            fileName: datas.images.image.name,
          },
          backgroundImage: {
            url: datas.images.backgroundImage.url,
            fileName: datas.images.backgroundImage.name,
          },
          additionImage: datas.images.additionImages,
        },
      },
      { new: true }
    );

    if (!updatedFilm) {
      return NextResponse.json({
        error: "Film not found",
        success: false,
      });
    }

    return NextResponse.json({ success: true, film: updatedFilm, form: datas });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
