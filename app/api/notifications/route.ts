import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { notificationSchema } from "@/lib/validation";
import Notification from "@/models/notification.model";
import "@/models/episode.model";
import "@/models/review.model";
import "@/models/comment.model";
import "@/models/film.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const type = searchParams.get("type");
      const isGlobal = searchParams.get("isGlobal");

      const skip = (page - 1) * limit;

      // Filter yaratish
      const filter: any = {};
      if (type) filter.type = type;
      if (isGlobal !== null) filter.isGlobal = isGlobal === "true";

      const notifications = await Notification.find(filter)
        .populate("user", "name email avatar")
        .populate("sender", "name email avatar")
        .populate("film", "title images")
        .populate("episode", "title episodeNumber")
        .populate("reviewReply", "text rating")
        .populate("commentReply", "text")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(filter);

      return NextResponse.json({
        success: true,
        data: notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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

export async function POST(req: NextRequest) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();

      const body = await req.json();

      // Validation
      const validatedData = notificationSchema.parse(body);

      // Notification yaratish
      const notificationData: any = {
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        isGlobal: validatedData.isGlobal,
        link: validatedData.link || null,
        sender: admin._id,
      };

      // Agar global bo'lmasa, userId kerak
      if (!validatedData.isGlobal) {
        if (!validatedData.userId) {
          return NextResponse.json(
            { success: false, error: "UserId kerak" },
            { status: 400 }
          );
        }
        notificationData.user = validatedData.userId;
      }

      // Type ga qarab field qo'shish
      if (validatedData.filmId) {
        notificationData.film = validatedData.filmId;
      }
      if (validatedData.episodeId) {
        notificationData.episode = validatedData.episodeId;
      }
      if (validatedData.reviewId) {
        notificationData.reviewReply = validatedData.reviewId;
      }
      if (validatedData.commentId) {
        notificationData.commentReply = validatedData.commentId;
      }

      const notification = await Notification.create(notificationData);

      // Populate qilib qaytarish
      const populatedNotification = await Notification.findById(
        notification._id
      )
        .populate("user", "name email avatar")
        .populate("film", "title images.image.url rating.average")
        .populate("episode", "title episodeNumber")
        .populate("reviewReply", "text rating")
        .populate("commentReply", "text");

      return NextResponse.json(
        {
          success: true,
          data: populatedNotification,
          message: "Notification muvaffaqiyatli yaratildi",
        },
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: "Bildirishnoma yaratishda xatolik!" },
        { status: 500 }
      );
    }
  });
}
