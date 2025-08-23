import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags } from "@/lib/utils";
import News from "@/models/news.model";
import { INews } from "@/types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    await connectToDatabase();
    const { newsId } = await params;
    console.log('api called');
    
    const news = await News.findById(newsId);
    if (!news) {
      return NextResponse.json(
        { error: "Yangilik topilmadi" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("GET /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { newsId: string } }
) {
  try {
    await connectToDatabase();
    const { newsId } = params;
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
      strict: true,
      remove: /['".,!?]/g,
    });

    const existing = await News.findOne({ slug, _id: { $ne: newsId } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // update object
    const updateData: any = {
      title,
      slug,
      content,
      description,
      tags,
      published,
    };

    // image ni boshqarish
    if (image === null) {
      updateData.$unset = { image: "" }; // DB dan fieldni o‘chiradi
    } else if (typeof image !== "undefined") {
      updateData.image = image;
    }

    const news = (await News.findByIdAndUpdate(newsId, updateData, {
      new: true,
    })) as INews;

    if (!news) {
      return NextResponse.json({ error: "Maqola topilmadi" }, { status: 404 });
    }

    revalidateTag(CacheTags.NEWS);
    revalidateTag(news._id);

    return NextResponse.json(
      {
        message: "Yangilik muvaffaqiyatli yangilandi",
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    await connectToDatabase();
    const { newsId } = await params;
    const news = await News.findByIdAndDelete(newsId);
    if (!news) {
      return NextResponse.json(
        { error: "Yangilik topilmadi" },
        { status: 404 }
      );
    }
    revalidateTag(CacheTags.NEWS);
    revalidateTag(newsId);
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("DELETE /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}
