import { authOnly } from "@/lib/auth-only";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/notification.model";
import NotificationRead from "@/models/user.notification.model";
import { NextRequest, NextResponse } from "next/server";

// POST - Notificationni o'qilgan deb belgilash
export async function POST(req: NextRequest) {
  return authOnly(async (user) => {
    try {
      await connectToDatabase();

      const { notificationId } = await req.json();

      if (!notificationId) {
        return NextResponse.json(
          { success: false, error: "Notification ID kiritilmadi" },
          { status: 400 }
        );
      }

      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return NextResponse.json(
          { success: false, error: "Notification topilmadi" },
          { status: 404 }
        );
      }

      // Global ham, shaxsiy ham — o'qilgan holat UserNotification'da saqlanadi.
      // (Notification modelida isGlobal/isRead maydonlari yo'q)
      await NotificationRead.findOneAndUpdate(
        {
          notification: notificationId,
          user: user._id,
        },
        {
          notification: notificationId,
          user: user._id,
          isRead: true,
          readAt: new Date(),
        },
        { upsert: true, new: true }
      );

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
