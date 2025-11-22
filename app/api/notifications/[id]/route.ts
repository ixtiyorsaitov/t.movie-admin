import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Notification from "@/models/notification.model";
import { NextRequest, NextResponse } from "next/server";

// GET - Bitta notificationni olish
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: notificationId } = await params;
    const notification = await Notification.findById(notificationId)
      .populate("user", "name email avatar")
      .populate("sender", "name email avatar")
      .populate("film", "title images")
      .populate("episode", "title episodeNumber")
      .populate("reviewReply", "text rating user")
      .populate("commentReply", "text user");

    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Notification topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Notificationni olishda xatolik!" },
      { status: 500 }
    );
  }
}

// PATCH - Notificationni yangilash
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { id: notificationId } = await params;
      const body = await req.json();

      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return NextResponse.json(
          { success: false, error: "Notification topilmadi" },
          { status: 404 }
        );
      }

      // Yangilash
      Object.assign(notification, body);
      await notification.save();

      const updatedNotification = await Notification.findById(notificationId)
        .populate("user", "name email avatar")
        .populate("film", "title images")
        .populate("episode", "title episodeNumber")
        .populate("reviewReply", "text rating")
        .populate("commentReply", "text");

      return NextResponse.json({
        success: true,
        data: updatedNotification,
        message: "Notification yangilandi",
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: "Bildirishnomani yangilashda xatolik!" },
        { status: 500 }
      );
    }
  });
}

// DELETE - Notificationni o'chirish
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();

      const notification = await Notification.findByIdAndDelete(params.id);

      if (!notification) {
        return NextResponse.json(
          { success: false, error: "Notification topilmadi" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Notification o'chirildi",
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: "Bildirishnomani o'chirishda xatolik!" },
        { status: 500 }
      );
    }
  });
}
