import { CacheTags, generateSlug } from "@/lib/utils";
import Annotation from "@/models/annotation.model";
import { IAnnotation } from "@/types/annotation";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ annotationId: string }> }
) {
  try {
    const { annotationId } = await params;
    const body = await req.json();
    const { subtitle, title, description, ytUrl } = body as IAnnotation;
    if (!subtitle || !title || !description || !ytUrl) {
      return NextResponse.json(
        { error: "Kerakli ma'lumotlarni to'liq kiriting" },
        { status: 400 }
      );
    }
    const slug = generateSlug(title);

    const annotation = await Annotation.findByIdAndUpdate(
      annotationId,
      {
        subtitle,
        title,
        description,
        ytUrl,
        slug,
      },
      { new: true }
    );
    if (!annotation) {
      return NextResponse.json(
        { error: "Anontatsiya topilmadi" },
        { status: 400 }
      );
    }
    revalidateTag(CacheTags.ANNOTATION);
    return NextResponse.json(
      { success: true, data: annotation },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ annotationId: string }> }
) {
  try {
    const { annotationId } = await params;
    const annotation = await Annotation.findByIdAndDelete(annotationId);
    if (!annotation) {
      return NextResponse.json(
        { error: "Annontation topilmadi" },
        { status: 400 }
      );
    }
    revalidateTag(CacheTags.ANNOTATION);
    return NextResponse.json({ success: true, data: annotation });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
