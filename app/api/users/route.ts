import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/user.model";
import { IUser, ROLE } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // query params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      role: { $ne: ROLE.SUPERADMIN },
    };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter).skip(skip).limit(limit).lean();

    const total = await User.countDocuments(filter);

    return NextResponse.json({
      success: true,
      datas: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return adminOnly(async (admin) => {
    try {
      await connectToDatabase();

      const body = await request.json();
      const { name, email, role } = body as IUser;
      if (role === ROLE.ADMIN || admin.role === ROLE.SUPERADMIN) {
        if (admin.role !== ROLE.SUPERADMIN) {
          return NextResponse.json(
            { error: "Adminni boshqara olmaysiz" },
            { status: 401 }
          );
        }
      }
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        return NextResponse.json(
          {
            error:
              "Bu email orqali boshqa foydalanuvchi ro'yhatdan o'tgan. Iltimos boshqa emailni ishlating",
          },
          { status: 400 }
        );
      }
      const user = await User.create({
        name,
        email,
        role,
      });

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}
