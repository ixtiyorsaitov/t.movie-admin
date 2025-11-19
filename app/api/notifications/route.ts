import { adminOnly } from "@/lib/admin-only";
import { authOnly } from "@/lib/auth-only";
import { connectToDatabase } from "@/lib/mongoose";
import { sendNotification } from "@/lib/send-notification";
import Notification from "@/models/notification.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return authOnly(async (user) => {
    try {
      await connectToDatabase();

      // 🔹 Query params: page, limit
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 10;

      const skip = (page - 1) * limit;

      // 🔹 Filter: user-specific + global
      const filter = {
        $or: [{ user: user._id }, { isGlobal: true }],
      };

      // 📌 Total count (pagination uchun)
      const total = await Notification.countDocuments(filter);

      // 📌 Notificationlarni olish
      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const formatted = notifications.map((n) => {
        return { ...n, isReadBy: n.isReadBy?.length || 0 };
      });

      // USER INTERFACE
      // 📌 Current user notificationni o'qiganmi?
      // isReadBy: ObjectId[] -> bizga isRead = true/false kerak
      //   const formatted = notifications.map((n) => ({
      //     ...n,
      //     isRead: n.isReadBy?.some(
      //       (id: string) => id.toString() === user._id.toString()
      //     ),
      //   }));

      // 📌 Pagination structure
      const pagination = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      return NextResponse.json(
        { success: true, datas: formatted, pagination },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Bildirishnomalarni olishda xatolik" },
        { status: 500 }
      );
    }
  });
}

export async function POST(req: NextRequest) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const datas = await req.json();
      const notification = await sendNotification({
        ...datas,
        sender: admin._id,
      });
      if (!notification.success) {
        return NextResponse.json(notification, { status: 500 });
      }
      return NextResponse.json({ notification }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Bildirishnoma yuborishda xatolik!" },
        { status: 500 }
      );
    }
  });
}
