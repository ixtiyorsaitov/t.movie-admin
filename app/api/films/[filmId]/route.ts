import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";

import { IFilm } from "@/types/film";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { generateSlug } from "@/lib/utils";
import Genre from "@/models/genre.model";
import Member from "@/models/member.model";
import Category from "@/models/category.model";
import { FilmType } from "@/types";

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
    const film = await Film.findById(filmId)
      .populate("genres")
      .populate("category")
      .populate({
        path: "actors",
        select: "_id",
      })
      .populate({
        path: "translators",
        select: "_id",
      });

    if (!film) {
      return NextResponse.json({ error: "Film topilmadi" });
    }
    return NextResponse.json({ success: true, data: film }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Filmni olishda xatolik" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string }> }
) {
  try {
    const { filmId } = await params;

    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(filmId)) {
      return NextResponse.json(
        { error: "Film ID formati xato" },
        { status: 400 }
      );
    }

    const reqjson = await req.json();

    const body = reqjson as IFilm;

    if (!body.title.trim() || !body.description.trim()) {
      return NextResponse.json(
        { error: "Maydonlarni to'ldiring" },
        { status: 400 }
      );
    }

    if (!body.category.toString().trim().length) {
      return NextResponse.json(
        { error: "Kategoriya tanlang" },
        { status: 400 }
      );
    }

    const categoryDoc = await Category.findById(body.category);
    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Kategoriya topilmadi" },
        { status: 404 }
      );
    }

    if (!body.genres || body.genres.length === 0) {
      return NextResponse.json(
        { error: "Kamida 1 ta janr tanlang" },
        { status: 400 }
      );
    }

    // --- Genres ---
    const genreDocs = await Promise.all(
      reqjson.genres.map((g: string) => Genre.findById(g))
    );
    const sortedGenres = genreDocs.filter((g) => g !== null).map((g) => g!._id);

    // --- Actors ---
    const actorDocs = await Promise.all(
      reqjson.actors.map((a: string) => Member.findById(a))
    );
    const sortedActors = actorDocs.filter((a) => a !== null).map((a) => a!._id);

    // --- Translators ---
    const translatorDocs = await Promise.all(
      reqjson.translators.map((t: string) => Member.findById(t))
    );
    const sortedTranslators = translatorDocs
      .filter((t) => t !== null)
      .map((t) => t!._id);

    // --- Slug ---
    const slug = !body.slug.trim()
      ? generateSlug(body.title)
      : body.slug.trim();

    const updatedFilm = await Film.findByIdAndUpdate(
      filmId,
      {
        title: body.title,
        description: body.description,
        slug,
        type: body.type ?? FilmType.SERIES,
        published: body.published ?? false,
        disableComments: body.disableComments ?? false,
        category: categoryDoc._id,
        genres: sortedGenres,
        actors: sortedActors,
        translators: sortedTranslators,
        images: {
          image: {
            url: body.images.image.url,
            name: body.images.image.name,
          },
          backgroundImage: {
            url: body.images.backgroundImage.url,
            name: body.images.backgroundImage.name,
          },
          additionImages: body.images.additionImages,
        },
      },
      { new: true }
    );

    if (!updatedFilm) {
      return NextResponse.json({ error: "Film topilmadi" }, { status: 404 });
    }

    // revalidateTag(CacheTags.FILMS);
    // revalidateTag(`${CacheTags.FILMS}-${filmId}`);
    // revalidateTag(CacheTags.SLIDER);

    return NextResponse.json({ success: true, data: updatedFilm });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
