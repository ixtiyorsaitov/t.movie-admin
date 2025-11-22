import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/notification.model";
import { NextRequest, NextResponse } from "next/server";

// GET - Bitta batch bo'yicha barcha notificationlarni olish
export async function GET(
  req: NextRequest,
  { params }: { params: { batchId: string } }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      const notifications = await Notification.find({
        batchId: params.batchId,
      })
        .populate("user", "name email avatar")
        .populate("film", "title images")
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: {
          batchId: params.batchId,
          count: notifications.length,
          notifications,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}

// DELETE - Bitta batch'dagi BARCHA notificationlarni o'chirish
export async function DELETE(
  req: NextRequest,
  { params }: { params: { batchId: string } }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      // Batch ID bo'yicha BARCHA notificationlarni o'chirish
      const deleteResult = await Notification.deleteMany({
        batchId: params.batchId,
      });

      return NextResponse.json({
        success: true,
        data: {
          batchId: params.batchId,
          deleted: deleteResult.deletedCount,
        },
        message: `${deleteResult.deletedCount} ta notification o'chirildi`,
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}
