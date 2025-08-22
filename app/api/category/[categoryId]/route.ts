import { connectToDatabase } from "@/lib/mongoose";
import Category from "@/models/category.model";
import Film from "@/models/film.model";
import { ICategory } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await connectToDatabase();
    const { categoryId } = await params;
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
      strict: true,
      remove: /['".,!?]/g,
    });
    const updatedGenre = await Category.findByIdAndUpdate(
      categoryId,
      {
        name: data.name,
        slug,
      },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedGenre });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await connectToDatabase();
    const { categoryId } = await params;

    const genre = await Category.findById(categoryId);
    if (!genre) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    await Film.updateMany(
      { genres: categoryId },
      { $pull: { genres: categoryId } }
    );

    await Category.findByIdAndDelete(categoryId);

    return NextResponse.json({
      success: true,
      message: "Category deleted and removed from films",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
