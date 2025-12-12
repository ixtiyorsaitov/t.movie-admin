import { connectToDatabase } from "@/lib/mongoose";
import { generateSlug } from "@/lib/utils";
import Category from "@/models/category.model";
import Film from "@/models/film.model";
import Genre from "@/models/genre.model";
import Member from "@/models/member.model";
import { FilmType } from "@/types";
import { IFilm } from "@/types/film";
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
    console.log(datas);

    if (!datas.title.trim() || !datas.description.trim()) {
      return NextResponse.json(
        { error: "Maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    if (!datas.category.toString().trim().length) {
      return NextResponse.json(
        { error: "Kategoriya tanlang" },
        { status: 400 }
      );
    }

    const ctg = await Category.findById(datas.category);
    if (!ctg) {
      return NextResponse.json(
        { error: "Kategoriya topilmadi" },
        { status: 404 }
      );
    }

    if (datas.genres.length === 0) {
      return NextResponse.json(
        { error: "Kamida 1 ta janr tanlang" },
        { status: 400 }
      );
    }

    const genreDocs = await Promise.all(
      body.genres.map((g: string) => Genre.findById(g))
    );

    const sortedGenres = genreDocs
      .filter((genre) => genre !== null)
      .map((genre) => genre!._id);

    const actorDocs = await Promise.all(
      body.actors.map((a: string) => Member.findById(a))
    );

    const sortedActors = actorDocs
      .filter((actor) => actor !== null)
      .map((actor) => actor!._id);

    const translatorDocs = await Promise.all(
      body.translators.map((t: string) => Member.findById(t))
    );

    const sortedTranslators = translatorDocs
      .filter((translator) => translator !== null)
      .map((translator) => translator!._id);

    const slug = !datas.slug.trim()
      ? generateSlug(datas.title)
      : datas.slug.trim();
    console.log("slug", datas.slug);

    const isAvailable = await Film.findOne({ slug });
    if (isAvailable) {
      return NextResponse.json(
        {
          error: "Bu slagdagi film allaqachon yaratilgan",
        },
        { status: 409 }
      );
    }

    const newFilm = await Film.create({
      title: datas.title,
      description: datas.description,
      type: datas.type ?? FilmType.SERIES,
      slug,
      published: datas.published || false,
      genres: sortedGenres,
      category: datas.category,
      translators: sortedTranslators,
      actors: sortedActors,
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
      disableComments: datas.disableComments ?? false,
    });

    return NextResponse.json({ success: true, data: newFilm }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
