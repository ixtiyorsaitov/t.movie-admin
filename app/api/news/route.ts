import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import News from "@/models/news.model";
import slugify from "slugify";
import { CacheTags } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Agar search mavjud bo'lsa, regex bilan filter
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Umumiy hujjatlar soni (search bo'yicha)
    const total = await News.countDocuments(query);

    // Pagination bilan hujjatlar
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      datas: news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
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
