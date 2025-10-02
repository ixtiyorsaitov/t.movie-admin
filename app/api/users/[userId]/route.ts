import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: Record<string, any> = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role === ROLE.ADMIN || admin.role === ROLE.SUPERADMIN) {
        if (admin.role !== ROLE.SUPERADMIN) {
          return NextResponse.json(
            { error: "Admin huquqini berish sizgamas" },
            { status: 401 }
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
      const { userId } = await params;
      const user = await User.findById(userId);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.role === ROLE.SUPERADMIN) {
        return NextResponse.json(
          { error: "Super admin huquqini o'chirish mumkin" },
          { status: 401 }
        );
      }

      await user.deleteOne();

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
