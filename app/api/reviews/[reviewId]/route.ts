import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Film from "@/models/film.model";
import Review from "@/models/review.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const body = await req.json();
    const { text, rating } = body as {
      text: string;
      rating: number;
    };

    if (!text || !rating) {
      return NextResponse.json(
        { error: "Kerakli ma'lumotlarni to'liq kiriting" },
        { status: 400 }
      );
    }

    // Eski reviewni olish
    const oldReview = await Review.findById(reviewId);
    if (!oldReview) {
      return NextResponse.json({ error: "Sharh topilmadi" }, { status: 400 });
    }

    const oldRating = oldReview.rating;

    // Reviewni yangilash
    oldReview.text = text;
    oldReview.rating = rating;
    await oldReview.save();
    const populatedReview = await Review.findById(reviewId)
      .populate("user", "name avatar")
      .populate("film", "title")
      .lean();

    // Film reytingini yangilash
    const updatedFilm = await Film.findByIdAndUpdate(
      oldReview.film,
      {
        $inc: {
          "rating.total": -oldRating + rating,
        },
      },
      { new: true }
    );

    if (!updatedFilm) {
      return NextResponse.json({ error: "Film topilmadi" }, { status: 400 });
    }

    // O‘rtacha hisoblash
    const avg = updatedFilm.rating.total / updatedFilm.rating.count;
    updatedFilm.rating.average = Math.round(avg * 10) / 10;
    await updatedFilm.save();

    return NextResponse.json(
      { success: true, data: populatedReview },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session?.currentUser) {
      return NextResponse.json(
        { error: "Ro'yhatdan o'tilmagan" },
        { status: 401 }
      );
    }

    const { reviewId } = await params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json({ error: "Sharh topilmadi" }, { status: 400 });
    }

    await review.deleteOne();

    const updatedFilm = await Film.findByIdAndUpdate(
      review.film,
      {
        $inc: {
          "rating.total": -review.rating,
          "rating.count": -1,
        },
      },
      { new: true }
    );

    if (!updatedFilm) {
      return NextResponse.json({ error: "Film topilmadi" }, { status: 400 });
    }

    if (updatedFilm.rating.count > 0) {
      const avg = updatedFilm.rating.total / updatedFilm.rating.count;
      updatedFilm.rating.average = Math.round(avg * 10) / 10;
    } else {
      updatedFilm.rating.average = 0;
    }
    await updatedFilm.save();
    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
