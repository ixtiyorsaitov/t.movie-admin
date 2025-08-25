import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags } from "@/lib/utils";
import Category from "@/models/category.model";
import { ICategory } from "@/types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const data = body as ICategory;
    if (!data.name) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter the categorie's name",
        },
        { status: 400 }
      );
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
    revalidateTag(CacheTags.CATEGORIES);
    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
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
