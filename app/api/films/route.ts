import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags, generateSlug } from "@/lib/utils";
import Category from "@/models/category.model";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import { IFilm } from "@/types/film";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }],
        }
      : {};

    const total = await Film.countDocuments(query);

    const films = await Film.find(query)
      .populate("genres")
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      datas: films,
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
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const datas = body as IFilm;

    const ctg = await Category.findById(datas.category);

    const genreDocs = await Promise.all(
      body.genres.map((g: string) => Genre.findById(g))
    );

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

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
      images: {
        image: {
          url: datas.images.image.url,
          name: datas.images.image.name,
        },
        backgroundImage: {
          url: datas.images.backgroundImage.url,
          name: datas.images.backgroundImage.name,
        },
      },
    });

    revalidateTag(CacheTags.FILMS);

    return NextResponse.json({ success: true, data: newFilm }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server xatosi" },
      { status: 500 }
    );
  }
}
