import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags, generateSlug } from "@/lib/utils";
import Annotation from "@/models/annotation.model";
import { IAnnotation } from "@/types/annotation";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const datas = await Annotation.find().lean();
    return NextResponse.json({ success: true, datas });
  } catch (error) {
    console.log(error);
    NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { subtitle, title, description, ytUrl } = body as IAnnotation;
    if (!subtitle || !title || !description || !ytUrl) {
      return NextResponse.json(
        { error: "Kerakli ma'lumotlarni to'liq kiriting" },
        { status: 400 }
      );
    }
    const slug = generateSlug(title);
    const isExists = await Annotation.findOne({ slug });
    if (isExists) {
      return NextResponse.json(
        { error: "Bu allaqachon avval yaratilgan" },
        { status: 400 }
      );
    }
    const annotation = await Annotation.create({
      subtitle,
      title,
      description,
      ytUrl,
      slug,
    });
    revalidateTag(CacheTags.ANNOTATION);
    return NextResponse.json({ success: true, data: annotation });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
