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
    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        text,
        rating,
      },
      { new: true }
    );
    if (!review) {
      return NextResponse.json(
        { error: "Anontatsiya topilmadi" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    console.log(error);
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

    if (updatedFilm) {
      if (updatedFilm.rating.count > 0) {
        const avg = updatedFilm.rating.total / updatedFilm.rating.count;
        updatedFilm.rating.average = Math.round(avg * 10) / 10;
      } else {
        updatedFilm.rating.total = 0;
        updatedFilm.rating.average = 0;
      }
      await updatedFilm.save();
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
