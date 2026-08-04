import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/models/comment.model";
import Review from "@/models/review.model";
import User from "@/models/user.model";
import { IUser, ROLE } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      const { userId } = await params;
      const body = await request.json();
      const { name, email, role } = body as IUser;
      const existingUser = await User.findById(userId).lean<IUser>();
      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // 🔒 Admin superadminni tahrirlay olmaydi
      if (
        existingUser.role === ROLE.SUPERADMIN &&
        admin.role !== ROLE.SUPERADMIN
      ) {
        return NextResponse.json(
          { error: "SuperAdmin hisobini o'zgartira olmaysiz" },
          { status: 403 }
        );
      }

      // 🔒 Hech kim API orqali SuperAdmin rolini bera olmaydi
      if (role === ROLE.SUPERADMIN) {
        return NextResponse.json(
          { error: "SuperAdmin rolini berib bo'lmaydi" },
          { status: 400 }
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) {
        // 🔒 Admin rolini faqat SuperAdmin o'zgartira oladi
        if (role === ROLE.ADMIN && admin.role !== ROLE.SUPERADMIN) {
          return NextResponse.json(
            { error: "Admin huquqini berish sizgamas" },
            { status: 403 }
          );
        }
        updateData.role = role;
      }

      if (existingUser.email !== email) {
        const existingEmail = await User.findOne({ email }).lean();

        if (existingEmail) {
          return NextResponse.json(
            {
              error:
                "Bu email orqali boshqa foydalanuvchi ro'yhatdan o'tgan. Iltimos boshqa emailni ishlating",
            },
            { status: 400 }
          );
        }
      }
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();
      if (admin.role !== ROLE.SUPERADMIN) {
        return NextResponse.json(
          { error: "Siz bu huquqga ega emassiz" },
          { status: 401 }
        );
      }
      const { userId } = await params;
      const user = await User.findById(userId);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      await Comment.deleteMany({ user: userId });
      await Review.deleteMany({ user: userId });

      await user.deleteOne();

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
