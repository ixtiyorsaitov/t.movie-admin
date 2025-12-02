import { authOnly } from "@/lib/auth-only";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/notification.model";
import NotificationRead from "@/models/user.notification.model";
import { NextRequest, NextResponse } from "next/server";

// GET - Foydalanuvchi uchun barcha notificationlar
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  return authOnly(async (user) => {
    try {
      // Faqat o'z notificationlarini ko'rishi mumkin
      if (user._id.toString() !== params.userId) {
        return NextResponse.json(
          { success: false, error: "Ruxsat yo'q" },
          { status: 403 }
        );
      }

      await connectToDatabase();

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const skip = (page - 1) * limit;

      // Personal notificationlar
      const personalNotifications = await Notification.find({
        user: params.userId,
      })
        .populate("sender", "name email avatar")
        .populate("film", "title images.image.url rating.average")
        .populate("episode", "title episodeNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Global notificationlar
      const globalNotifications = await Notification.find({
        isGlobal: true,
      })
        .populate("sender", "name email avatar")
        .populate("film", "title images")
        .sort({ createdAt: -1 })
        .limit(limit);

      // O'qilgan global notificationlar
      const readNotificationIds = await NotificationRead.find({
        user: params.userId,
        notification: { $in: globalNotifications.map((n) => n._id) },
      }).distinct("notification");

      // Global notificationlarga isRead qo'shish
      const globalWithReadStatus = globalNotifications.map((notification) => ({
        ...notification.toObject(),
        isRead: readNotificationIds.some((id) => id.equals(notification._id)),
      }));

      return NextResponse.json({
        success: true,
        data: {
          personal: personalNotifications,
          global: globalWithReadStatus,
        },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: "Bildirishnomalarni olishda xatolik!" },
        { status: 500 }
      );
    }
  });
}
