import { NextRequest, NextResponse } from "next/server";
import { NotificationType } from "@/types";
import { nanoid } from "nanoid"; // yoki crypto.randomUUID()
import { connectToDatabase } from "@/lib/mongoose";
import Subscriber from "@/models/subscriber.model";
import Notification from "@/models/notification.model";
import { adminOnly } from "@/lib/admin-only";

// POST - Filmga obuna bo'lganlarga notification yuborish
export async function POST(req: NextRequest) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      const { filmId, title, message, link } = await req.json();

      // 1. Filmga obuna bo'lgan userlarni topish
      const subscriptions = await Subscriber.find({
        film: filmId,
        subscriptionType: "FILM",
      }).select("user");

      const subscribedUserIds = subscriptions.map((sub) => sub.user);

      if (subscribedUserIds.length === 0) {
        return NextResponse.json({
          success: false,
          error: "Bu filmga obuna bo'lgan foydalanuvchilar yo'q",
        });
      }

      // 2. YANGI batch ID yaratish - bu ID bilan barcha notificationlar bog'lanadi
      const batchId = nanoid(); // Misol: "V1StGXR8_Z5jdHi6B-myT"

      // 3. Har bir user uchun notification yaratish (BATCH ID bilan)
      const notifications = subscribedUserIds.map((userId) => ({
        user: userId,
        film: filmId,
        title,
        message,
        type: NotificationType.FILM,
        link: link || `/film/${filmId}`,
        isGlobal: false,
        batchId, // Bu muhim!
      }));

      const created = await Notification.insertMany(notifications);

      return NextResponse.json({
        success: true,
        data: {
          batchId, // Frontend uchun qaytaramiz
          count: created.length,
          notifications: created,
        },
        message: `${created.length} ta foydalanuvchiga notification yuborildi`,
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}
