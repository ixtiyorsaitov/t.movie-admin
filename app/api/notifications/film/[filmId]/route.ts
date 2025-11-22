import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/notification.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { filmId: string } }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      // Filmga yuborilgan barcha batchlarni topish
      const batches = await Notification.aggregate([
        {
          $match: {
            film: new mongoose.Types.ObjectId(params.filmId),
            batchId: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$batchId",
            count: { $sum: 1 },
            title: { $first: "$title" },
            message: { $first: "$message" },
            createdAt: { $first: "$createdAt" },
            link: { $first: "$link" },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return NextResponse.json({
        success: true,
        data: batches.map((batch) => ({
          batchId: batch._id,
          count: batch.count,
          title: batch.title,
          message: batch.message,
          createdAt: batch.createdAt,
          link: batch.link,
        })),
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}
