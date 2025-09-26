import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/models/comment.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const { commentId } = await params;
      const body = await req.json();
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return NextResponse.json({ error: "Izoh topilmadi" }, { status: 404 });
      }
      if (comment.user.toString() !== admin._id.toString()) {
        return NextResponse.json(
          { error: "Izohning egasi emassiz" },
          { status: 401 }
        );
      }
      const { content, filmId, asAdmin } = body;

      if (!content) {
        return NextResponse.json({ error: "Izoh majburiy" }, { status: 400 });
      }
      const repliedComment = await Comment.create({
        user: admin._id,
        film: filmId,
        parent: comment._id,
        content,
      });
      comment.reply = {
        comment: repliedComment._id,
        user: admin._id,
        asAdmin,
      };

      await comment.save();
      await comment.populate({ path: "user", select: "name avatar" });
      await comment.populate({ path: "film", select: "title" });
      await repliedComment.populate({ path: "user", select: "name avatar" });
      await repliedComment.populate({ path: "film", select: "title" });
      return NextResponse.json({
        success: true,
        data: comment,
        replied: repliedComment,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const { commentId } = await params;
      const body = await req.json();
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return NextResponse.json({ error: "Izoh topilmadi" }, { status: 404 });
      }
      if (comment.user.toString() !== admin._id.toString()) {
        return NextResponse.json(
          { error: "Izohning egasi emassiz" },
          { status: 401 }
        );
      }
      const { content, asAdmin } = body;

      if (!content) {
        return NextResponse.json({ error: "Izoh majburiy" }, { status: 400 });
      }

      const replyComment = await Comment.findByIdAndUpdate(
        comment.reply?.comment,
        {
          content,
          asAdmin,
        },
        { new: true }
      )
        .populate({ path: "user", select: "name avatar" })
        .populate({ path: "film", select: "title" });
      if (!replyComment) {
        return NextResponse.json(
          { error: "Izoh javobi topilmadi" },
          { status: 404 }
        );
      }

      await comment.save();
      await comment.populate({ path: "reply.comment" });
      await comment.populate({ path: "user", select: "name avatar" });
      await comment.populate({ path: "film", select: "title" });
      return NextResponse.json({
        success: true,
        data: comment,
        replied: replyComment,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const { commentId } = await params;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return NextResponse.json({ error: "Izoh topilmadi" }, { status: 404 });
      }
      if (comment.user.toString() !== admin._id.toString()) {
        return NextResponse.json(
          { error: "Izohning egasi emassiz" },
          { status: 401 }
        );
      }
      const deletedReply = await Comment.findByIdAndDelete(
        comment.reply.comment
      );
      comment.reply = null;
      await comment.save();
      await comment.populate({ path: "user", select: "name avatar" });
      await comment.populate({ path: "film", select: "title" });

      return NextResponse.json({
        success: true,
        data: comment,
        deleted: deletedReply,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
