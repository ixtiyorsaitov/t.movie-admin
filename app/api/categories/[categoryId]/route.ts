import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags, generateSlug } from "@/lib/utils";
import Category from "@/models/category.model";
import Film from "@/models/film.model";
import { ICategory } from "@/types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const revalidateCtg = (categoryId: string) => {
  revalidateTag(CacheTags.CATEGORIES);
  revalidateTag(`${CacheTags.CATEGORIES}-${categoryId}`);
};

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
        revalidateCtg(categoryId);
        return NextResponse.json(
          { error: "Kategoriya topilmadi" },
          { status: 404 }
        );
      }
      revalidateCtg(categoryId);
      return NextResponse.json(
        { success: true, data: updatedCategory },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { success: false, message: "Server xatoligi" },
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
        revalidateCtg(categoryId);
        return NextResponse.json(
          { error: "Kategoriya topilmadi" },
          { status: 404 }
        );
      }

      await Film.updateMany(
        { genres: categoryId },
        { $pull: { genres: categoryId } }
      );

      await Category.findByIdAndDelete(categoryId);
      revalidateTag(CacheTags.FILMS);
      revalidateCtg(categoryId);
      return NextResponse.json(
        {
          success: true,
          message: "Category deleted and removed from films",
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { success: false, message: "Server xatoligi" },
        { status: 500 }
      );
    }
  });
}
