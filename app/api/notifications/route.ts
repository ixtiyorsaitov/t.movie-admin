import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { notificationSchema } from "@/lib/validation";
import Notification from "@/models/notification.model";
import "@/models/episode.model";
import "@/models/review.model";
import "@/models/comment.model";
import "@/models/film.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { NotificationSendingType, NotificationType } from "@/types";
import {
  defineNotificationSendingType,
  defineNotificationType,
} from "@/lib/utils";
import UserNotification from "@/models/user.notification.model";
import User from "@/models/user.model";
import Subscriber from "@/models/subscriber.model";

export async function GET(req: NextRequest) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      const { searchParams } = new URL(req.url);

      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const type = searchParams.get("type");

      const skip = (page - 1) * limit;

      // Filter
      const filter: any = {};
      if (type) filter.type = type;

      // Basic pagination
      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(filter);

      return NextResponse.json({
        success: true,
        datas: notifications,
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

      // 1) Asosiy schema bilan validatsiya (zod)
      let validatedData;
      try {
        validatedData = notificationSchema.parse(body);
      } catch (err: any) {
        // Zod error bo'lsa 422 qaytarish va tafsilotlarni yuborish
        return NextResponse.json(
          {
            success: false,
            error: "Validation error",
            details: err.errors ?? err,
          },
          { status: 422 }
        );
      }

      // Yordamchi: ObjectId tekshiruvi
      const isValidObjectId = (id?: string) =>
        typeof id === "string" &&
        id.trim() !== "" &&
        mongoose.Types.ObjectId.isValid(id);

      // 2) Shartli (business) validatsiyalar
      const type = validatedData.type as string;
      const sendingType = validatedData.sendingType as string | undefined;
      const sendingUserId = validatedData.sendingUserId as string | undefined;
      const sendingFilmId = validatedData.sendingFilmId as string | undefined;

      // Type asosida required fieldlar
      if (type === NotificationType.FILM) {
        if (!isValidObjectId(validatedData.filmId)) {
          return NextResponse.json(
            {
              success: false,
              error: `Agar notification turi ${defineNotificationType(
                NotificationType.FILM
              )} bo'lsa, valid filmId kerak.`,
            },
            { status: 400 }
          );
        }
      }
      if (type === NotificationType.EPISODE) {
        if (!isValidObjectId(validatedData.episodeId)) {
          return NextResponse.json(
            {
              success: false,
              error: `Agar notification turi ${defineNotificationType(
                NotificationType.EPISODE
              )} bo'lsa, valid episodeId kerak.`,
            },
            { status: 400 }
          );
        }
      }
      if (type === NotificationType.REVIEW_REPLY) {
        if (!isValidObjectId(validatedData.reviewId)) {
          return NextResponse.json(
            {
              success: false,
              error: `Agar notification turi ${defineNotificationType(
                NotificationType.REVIEW_REPLY
              )} bo'lsa, valid reviewId kerak.`,
            },
            { status: 400 }
          );
        }
      }
      if (type === NotificationType.COMMENT_REPLY) {
        if (!isValidObjectId(validatedData.commentId)) {
          return NextResponse.json(
            {
              success: false,
              error: `Agar notification turi ${defineNotificationType(
                NotificationType.COMMENT_REPLY
              )} bo'lsa, valid commentId kerak.`,
            },
            { status: 400 }
          );
        }
      }

      // Sending turi bo'yicha required fieldlar
      if (sendingType === NotificationSendingType.USER) {
        if (!isValidObjectId(sendingUserId)) {
          return NextResponse.json(
            {
              success: false,
              error: `Agar sending turi ${defineNotificationSendingType(
                NotificationSendingType.USER
              )} bo'lsa, valid sendingUserId kerak.`,
            },
            { status: 400 }
          );
        }
      }

      if (sendingType === NotificationSendingType.FILM_SUBSCRIBERS) {
        if (!isValidObjectId(sendingFilmId)) {
          return NextResponse.json(
            {
              success: false,
              error: `Agar sending turi ${defineNotificationSendingType(
                NotificationSendingType.FILM_SUBSCRIBERS
              )} bo'lsa, valid sendingFilmId (film id) kerak.`,
            },
            { status: 400 }
          );
        }
      }

      // 3) Notification uchun data tuzish
      const notificationData: any = {
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        link: validatedData.link || null,
        sender: admin._id,
        sending: {
          type: validatedData.sendingType || NotificationSendingType.ALL,
          user: null,
          film: null,
        },
      };

      // Shartli maydonlarni qo'shish
      if (isValidObjectId(validatedData.filmId)) {
        notificationData.film = validatedData.filmId;
      }
      if (isValidObjectId(validatedData.episodeId)) {
        notificationData.episode = validatedData.episodeId;
      }
      if (isValidObjectId(validatedData.reviewId)) {
        notificationData.reviewReply = validatedData.reviewId;
      }
      if (isValidObjectId(validatedData.commentId)) {
        notificationData.commentReply = validatedData.commentId;
      }

      // sending.user / sending.film ni to'ldirish
      if (sendingType === NotificationSendingType.USER) {
        notificationData.sending.user = sendingUserId;
      } else if (sendingType === NotificationSendingType.FILM_SUBSCRIBERS) {
        notificationData.sending.film = sendingFilmId;
      }
      // agar ALL bo'lsa, sending.user va sending.film null bo'lib qoladi

      // 4) Yaratish
      const notification = await Notification.create(notificationData);

      // 5) Populate: schema da sender bor, shuning uchun sender ni populate qilamiz
      const populatedNotification = await Notification.findById(
        notification._id
      );
      // .populate("sender", "name email avatar")
      // .populate("film", "title images rating")
      // .populate("episode", "title episodeNumber")
      // .populate("reviewReply", "text rating")
      // .populate("commentReply", "text");

      // 6) USER NOTIFICATION yaratish (sending turiga qarab)
      if (sendingType === NotificationSendingType.ALL) {
        // Barcha userlarni olish
        const allUsers = await User.find().select("_id");

        const bulkData = allUsers.map((u) => ({
          user: u._id,
          notification: notification._id,
        }));

        if (bulkData.length > 0) {
          await UserNotification.insertMany(bulkData);
        }
      } else if (sendingType === NotificationSendingType.USER) {
        // Faqat bitta userga
        await UserNotification.create({
          user: sendingUserId,
          notification: notification._id,
        });
      } else if (sendingType === NotificationSendingType.FILM_SUBSCRIBERS) {
        // Film obunachilarini olish
        const subscribers = await Subscriber.find({
          film: sendingFilmId,
        }).select("user");

        const bulkData = subscribers.map((s) => ({
          user: s.user,
          notification: notification._id,
        }));

        if (bulkData.length > 0) {
          await UserNotification.insertMany(bulkData);
        }
      }

      

      return NextResponse.json(
        {
          success: true,
          data: populatedNotification,
          message: "Notification muvaffaqiyatli yaratildi",
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Notification POST error:", error);
      return NextResponse.json(
        { success: false, error: "Bildirishnoma yaratishda xatolik!" },
        { status: 500 }
      );
    }
  });
}
