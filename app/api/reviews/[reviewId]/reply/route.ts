import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Review from "@/models/review.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const { reviewId } = await params;
      const body = await req.json();
      const { text, asAdmin } = body as {
        text: string;
        asAdmin: boolean;
      };

      if (!text) {
        return NextResponse.json(
          { error: "Kerakli ma'lumotlarni to'liq kiriting" },
          { status: 400 }
        );
      }

      const reply = await Review.findById(reviewId);

      if (!reply) {
        return NextResponse.json({ error: "Sharh topilmadi" }, { status: 400 });
      }

      if (reply.reply) {
        console.log("currentUserId", admin._id.toString());
        console.log("replyUserId", reply.reply.user.toString());

        if (admin._id.toString() === reply.reply.user.toString()) {
          reply.reply = {
            text,
            user: admin._id,
            asAdmin,
          };
        } else {
          return NextResponse.json(
            { error: "Javobni faqat uni yozgan odam tahrirlaydi" },
            { status: 400 }
          );
        }
      } else {
        reply.reply = {
          text,
          user: admin._id,
          asAdmin,
        };
      }
      await reply.save();
      await reply.populate("user", "name avatar");
      await reply.populate("film", "title");

      return NextResponse.json({ success: true, data: reply });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const { reviewId } = await params;

      const review = await Review.findById(reviewId);

      if (!review) {
        return NextResponse.json({ error: "Sharh topilmadi" }, { status: 400 });
      }

      if (review.reply) {
        if (review.reply.user.toString() !== admin._id.toString()) {
          return NextResponse.json(
            { error: "Javobni faqat uni yozgan odam o'chira oladi" },
            { status: 400 }
          );
        }

        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          { $unset: { reply: 1 } },
          { new: true }
        )
          .populate("user", "name avatar")
          .populate("film", "title");

        return NextResponse.json({ success: true, data: updatedReview });
      } else {
        return NextResponse.json(
          { error: "Javob hali yozilmagan" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
