import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import { IFilm } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
export async function POST(req: NextRequest) {
  try {
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

    const isAvailable = await Film.findOne({ slug });
    if (isAvailable) {
      return NextResponse.json({
        error: "This film already created",
        success: false,
      });
    }

    const newFilm = await Film.create({
      title: datas.title,
      slug,
      description: datas.description,
      type: datas.type,
      published: datas.published || false,
      genres: sortedGenres,
      seasons: datas.type === "series" ? [] : undefined,
    });

    return NextResponse.json({ success: true, film: newFilm });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
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

    const editedFilm = await Film.findOneAndUpdate(
      { slug },
      {
        title: datas.title,
        slug,
        description: datas.description,
        type: datas.type,
        published: datas.published || false,
        genres: sortedGenres,
        rating: {
          avarage: datas.rating?.avarage || 0,
          total: datas.rating?.total || 0,
          count: datas.rating?.count || 0,
        },
        meta: {
          likes: datas.meta?.likes || [],
          watchList: datas.meta?.watchList || [],
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
          additionImage: datas.images.additionImages || [],
        },
      },
      { new: true }
    );

    if (!editedFilm) {
      return NextResponse.json({
        error: "Film not found",
        success: false,
      });
    }

    return NextResponse.json({ success: true, film: editedFilm });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const datas = await Film.find().populate("genres");

    const filtered = datas.map((data) => {
      const obj = data.toObject(); // <-- fix
      return {
        ...obj,
        meta: {
          likes: obj.meta.likes.length,
          watchList: obj.meta.watchList.length,
        },
      };
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
