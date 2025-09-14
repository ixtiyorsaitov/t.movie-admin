import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Review from "@/models/review.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const total = await Review.countDocuments();

    const datas = await Review.find()
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "name avatar",
      })
      .populate({
        path: "film",
        select: "title",
      })
      .lean();

    return NextResponse.json({
      success: true,
      datas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.currentUser) {
      return NextResponse.json(
        { error: "Ro'yhatdan o'tilmagan" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filmId, rating, text } = body as {
      filmId: string;
      rating: number;
      text: string;
    };

    if (!filmId || !rating) {
      return NextResponse.json(
        { error: "Kerakli ma'lumotlarni to'liq kiriting" },
        { status: 400 }
      );
    }

    const existingReview = await Review.findOne({
      user: session.currentUser._id,
      filmId,
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "Siz bu filmga allaqachon sharh qoldirgansiz" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      user: session.currentUser._id,
      film: filmId,
      rating,
      text,
    });
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name avatar")
      .populate("film", "title")
      .lean();
    const updatedFilm = await Film.findByIdAndUpdate(
      filmId,
      {
        $inc: { "rating.total": rating, "rating.count": 1 },
      },
      { new: true }
    );

    if (!updatedFilm) {
      return NextResponse.json({ error: "Film topilmadi" }, { status: 400 });
    }
    const avg = updatedFilm.rating.total / updatedFilm.rating.count;
    updatedFilm.rating.average = Math.round(avg * 10) / 10;
    await updatedFilm.save();

    return NextResponse.json({ success: true, data: populatedReview });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
