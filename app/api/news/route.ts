import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import News from "@/models/news.model";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    // Umumiy hujjatlar soni
    const total = await News.countDocuments();

    // Pagination bilan hujjatlar
    const news = await News.find()
      .sort({ createdAt: -1 }) // eng oxirgi yangiliklar birinchi chiqadi
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      datas: news,
      pagination: {
        total, // jami hujjatlar soni
        page, // hozirgi sahifa
        limit, // har bir sahifadagi soni
        totalPages: Math.ceil(total / limit), // umumiy sahifalar
      },
    });
  } catch (error) {
    console.error("GET /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, content, description, image, tags, published } = body;

    if (!title || !content || !description) {
      return NextResponse.json(
        { error: "Majburiy maydonlar to‘ldirilmagan" },
        { status: 400 }
      );
    }

    let slug = slugify(title, {
      lower: true,
      strict: true, // faqat a-z va 0-9 qoldiradi
      remove: /['".,!?]/g, // qo‘shimcha belgilarni olib tashlaydi
    });

    // slug unikal bo'lishini tekshirish
    const existing = await News.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await News.create({
      title,
      slug,
      content,
      description,
      image,
      tags,
      published,
    });

    return NextResponse.json(
      {
        message: "Yangilik muvaffaqiyatli qo‘shildi",
        success: true,
        data: news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}
