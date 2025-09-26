import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/models/comment.model";
import "@/models/film.model";
import "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // query parametrlardan page va limit olish
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // qaysi documentdan boshlanishini hisoblash
    const skip = (page - 1) * limit;

    // umumiy commentlar sonini hisoblash
    const total = await Comment.countDocuments();

    // faqat kerakli qismini olish
    const comments = await Comment.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "name avatar role" })
      .populate({ path: "film", select: "title" })
      .populate({ path: "reply.user", select: "name avatar" })
      .populate({ path: "reply.comment", select: "content" })
      .lean();

    return NextResponse.json(
      {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
        datas: comments,
      },
      { status: 200 }
    );
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
    const { filmId, content } = await req.json();
    const comment = await Comment.create({
      user: session.currentUser._id,
      film: filmId,
      content,
    });
    await comment.populate({ path: "user", select: "name avatar" });
    await comment.populate({ path: "film", select: "title" });
    return NextResponse.json({ success: true, data: comment }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
