import { connectToDatabase } from "@/lib/mongoose";
import Category from "@/models/category.model";
import { ICategory } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = body as ICategory;
    if (!data.name) {
      return NextResponse.json({
        success: false,
        error: "Please enter the categorie's name",
      });
    }
    const slug = slugify(data.name, {
      lower: true,
      strict: true, // faqat a-z va 0-9 qoldiradi
      remove: /['".,!?]/g, // qo‘shimcha belgilarni olib tashlaydi
    });
    const newCategory = await Category.create({
      name: data.name,
      slug,
    });
    return NextResponse.json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
