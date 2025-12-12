import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { generateSlug } from "@/lib/utils";
import Category from "@/models/category.model";
import { ICategory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const body = await req.json();
      const data = body as ICategory;
      if (!data.name) {
        return NextResponse.json(
          {
            error: "Iltimos kategoriya nomini kiriting",
          },
          { status: 400 }
        );
      }

      const slug = generateSlug(data.name);
      const existing = await Category.findOne({ slug });
      if (existing) {
        return NextResponse.json(
          {
            error: "Bu kategoriya allaqachon mavjud.",
          },
          { status: 400 }
        );
      }
      const newCategory = await Category.create({
        name: data.name,
        slug,
      });
      return NextResponse.json(
        { success: true, data: newCategory },
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
  });
}

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find();

    return NextResponse.json(
      { datas: categories, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server xatoligi. Keyinroq urinib ko'ring" },
      { status: 500 }
    );
  }
}
