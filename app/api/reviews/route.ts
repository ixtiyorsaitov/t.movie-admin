import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Review from "@/models/review.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const replyFilter = searchParams.get("replyFilter") || "all";
    const ratingFilter = searchParams.get("ratingFilter") || "all";
    const sortBy = (searchParams.get("sortBy") || "newest") as
      | "newest"
      | "oldest"
      | "popular";

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    // 🔎 text bo‘yicha qidirish
    if (search) {
      filter.text = { $regex: search, $options: "i" };
    }

    // 🔎 reply bo‘yicha filterlash
    if (replyFilter === "replied") {
      filter.reply = { $exists: true, $ne: null };
    } else if (replyFilter === "not-replied") {
      filter.reply = { $exists: false };
    }

    // ⭐ rating bo‘yicha filterlash
    if (ratingFilter === "high") {
      filter.rating = { $gte: 8, $lte: 10 };
    } else if (ratingFilter === "medium") {
      filter.rating = { $gte: 5, $lte: 7 };
    } else if (ratingFilter === "low") {
      filter.rating = { $gte: 1, $lte: 4 };
    }

    let datas: unknown[] = [];
    let total = 0;

    if (sortBy === "popular") {
      // 🏆 Eng ko‘p like olgan reviewlar
      const pipeline: mongoose.PipelineStage[] = [
        { $match: filter },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "review",
            as: "likes",
          },
        },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
          },
        },
        { $sort: { likesCount: -1 as const } }, // ✅ "as const" bilan
        { $skip: skip },
        { $limit: limit },
      ];

      const aggResults = await Review.aggregate(pipeline);

      // populate qilish kerak bo‘ladi
      datas = await Review.populate(aggResults, [
        { path: "user", select: "name avatar" },
        { path: "film", select: "title" },
      ]);

      total = await Review.countDocuments(filter);
    } else {
      // 🔄 Oddiy sort (newest/oldest)
      const sortOption =
        sortBy === "newest"
          ? ({ createdAt: -1 } as const)
          : ({ createdAt: 1 } as const);

      total = await Review.countDocuments(filter);

      datas = await Review.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate({ path: "user", select: "name avatar" })
        .populate({ path: "film", select: "title" })
        .lean();
    }

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
    return NextResponse.json(
      { error: "Sharhlarni olishda xatolik yuz berdi" },
      { status: 500 }
    );
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
