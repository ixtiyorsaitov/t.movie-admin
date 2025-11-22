import { authOnly } from "@/lib/auth-only";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/notification.model";
import NotificationRead from "@/models/notification.read.schema";
import { NextRequest, NextResponse } from "next/server";

// POST - Notificationni o'qilgan deb belgilash
export async function POST(req: NextRequest) {
  return authOnly(async (user) => {
    try {
      await connectToDatabase();

      const { notificationId } = await req.json();

      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return NextResponse.json(
          { success: false, error: "Notification topilmadi" },
          { status: 404 }
        );
      }

      // Agar personal notification bo'lsa
      if (!notification.isGlobal) {
        notification.isRead = true;
        await notification.save();
      } else {
        // Global notification uchun NotificationRead yaratish
        await NotificationRead.findOneAndUpdate(
          {
            notification: notificationId,
            user: user._id,
          },
          {
            notification: notificationId,
            user: user._id,
          },
          { upsert: true, new: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Notification o'qildi",
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: "Bildirishnomani o'qilishda xatolik!" },
        { status: 500 }
      );
    }
  });
}
