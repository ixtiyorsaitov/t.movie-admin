import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags, generateSlug } from "@/lib/utils";
import Category from "@/models/category.model";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import { IFilm } from "@/types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const datas = body as IFilm;

    const ctg = await Category.findById(datas.category);

    // Genrelarni to'g'ri yig'ish
    const genreDocs = await Promise.all(
      body.genres.map((g: string) => Genre.findById(g))
    );

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

    // Slug yaratish
    const slug = generateSlug(datas.title);

    const isAvailable = await Film.findOne({ slug });
    if (isAvailable) {
      return NextResponse.json(
        {
          error: "Bu film allaqachon yaratilgan",
        },
        { status: 409 }
      );
    }

    const newFilm = await Film.create({
      title: datas.title,
      slug,
      description: datas.description,
      type: datas.type,
      published: datas.published || false,
      genres: sortedGenres,
      catergory: ctg,
      seasons: datas.type === "series" ? [] : undefined,
    });

    return NextResponse.json({ success: true, film: newFilm }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server xatosi" },
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
    const ctg = await Category.findById(datas.category);

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

    // Slug yaratish
    const slug = generateSlug(datas.title);

    const editedFilm = await Film.findOneAndUpdate(
      { slug },
      {
        title: datas.title,
        slug,
        description: datas.description,
        type: datas.type,
        published: datas.published || false,
        genres: sortedGenres,
        catergory: ctg,
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
        error: "Film topilmadi",
      });
    }
    revalidateTag(CacheTags.ANIME);
    return NextResponse.json({ success: true, film: editedFilm });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server xatosi" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Search query
    const query = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }],
        }
      : {};

    // Count total
    const total = await Film.countDocuments(query);

    // Get films with pagination
    const films = await Film.find(query)
      .populate("genres")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Modify response (meta counts)
    const filtered = films.map((data) => {
      const obj = data.toObject();
      return {
        ...obj,
        meta: {
          likes: obj.meta.likes.length,
          watchList: obj.meta.watchList.length,
        },
      };
    });

    return NextResponse.json({
      datas: filtered,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
    });
  } catch (error) {
    console.error("GET /films error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}
