import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags } from "@/lib/utils";
import News from "@/models/news.model";
import { INews } from "@/types";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

type UpdateNews = Partial<INews> & {
  $unset?: {
    [K in keyof INews]?: 1; // yoki "" ham ishlaydi, MongoDB uchun
  };
};
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    await connectToDatabase();
    const { newsId } = await params;

    const news = await News.findById(newsId);
    if (!news) {
      return NextResponse.json(
        { error: "Yangilik topilmadi" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: news },
      { headers: { "Cache-Tag": `${CacheTags.NEWS}-${newsId}` } }
    );
  } catch (error) {
    console.error("GET /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    await connectToDatabase();
    const { newsId } = await params;
    const body = await req.json();
    const { title, content, description, image, tags, published, expireAt } =
      body;

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
    const updateData: UpdateNews = {
      title,
      slug,
      content,
      description,
      tags,
      published,
    };
    if (expireAt) {
      updateData.expireAt = new Date(expireAt);
    } else {
      updateData.expireAt = null;
    }

    if (image === null) {
      updateData.image = null;
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
    revalidateTag(`${CacheTags.NEWS}-${newsId}`);

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
    revalidateTag(`${CacheTags.NEWS}-${newsId}`);
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("DELETE /news error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}
