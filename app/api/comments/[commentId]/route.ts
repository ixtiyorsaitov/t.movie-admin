import { adminOnly } from "@/lib/admin-only";
import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/models/comment.model";
import { IComment } from "@/types/comment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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
    const { commentId } = await params;
    const body = await req.json();
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Komentariya topilmadi" },
        { status: 404 }
      );
    }
    if (comment.user.toString() !== session.currentUser._id.toString()) {
      return NextResponse.json(
        { error: "Komentariyaning egasi emassiz" },
        { status: 401 }
      );
    }
    const { content } = body as IComment;
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }
    comment.content = content;
    await comment.save();
    await comment.populate({ path: "user", select: "name avatar" });
    await comment.populate({ path: "film", select: "title" });
    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
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
    const { commentId } = await params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { error: "Komentariya topilmadi" },
        { status: 404 }
      );
    }
    if (comment.user.toString() !== session.currentUser._id.toString()) {
      return NextResponse.json(
        { error: "Komentariyaning egasi emassiz!" },
        { status: 401 }
      );
    }
    if (comment.parent) {
      await Comment.findByIdAndUpdate(comment.parent, {
        reply: null,
      });
    }
    if (comment.reply) {
      await Comment.findByIdAndDelete(comment.reply.comment);
    }
    await comment.deleteOne();
    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
