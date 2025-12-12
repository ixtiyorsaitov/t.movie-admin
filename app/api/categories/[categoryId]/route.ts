import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { generateSlug } from "@/lib/utils";
import Category from "@/models/category.model";
import Film from "@/models/film.model";
import { ICategory } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { categoryId } = await params;
      const body = await req.json();
      const data = body as ICategory;
      if (!data.name) {
        return NextResponse.json(
          {
            success: false,
            error: "Iltimos kategoriya nomini kiriting",
          },
          { status: 400 }
        );
      }
      const slug = generateSlug(data.name);
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
          name: data.name,
          slug,
        },
        { new: true }
      );
      if (!updatedCategory) {
        return NextResponse.json(
          { error: "Kategoriya topilmadi" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: updatedCategory },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Kategoriyani yangilashda xatolik" },
        { status: 500 }
      );
    }
  });
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { categoryId } = await params;

      const genre = await Category.findById(categoryId);
      if (!genre) {
        return NextResponse.json(
          { error: "Kategoriya topilmadi" },
          { status: 404 }
        );
      }

      await Film.updateMany(
        { category: categoryId },
        { $set: { category: null } }
      );

      await Category.findByIdAndDelete(categoryId);
      return NextResponse.json(
        {
          success: true,
          message: "Kategoriya o'chirildi va barcha filmlardan olib tashlandi",
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Kategoriyani o'chirishda xatolik" },
        { status: 500 }
      );
    }
  });
}
