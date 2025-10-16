import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags } from "@/lib/utils";
import Price from "@/models/price.model";
import { IPrice } from "@/types/price";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  try {
    await connectToDatabase();
    const { priceId } = await params;
    const price = await Price.findById(priceId).lean();
    if (!price) {
      return NextResponse.json({ error: "Ta'rif topilmadi" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: price });
  } catch (error) {
    console.error("GET /prices error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  try {
    await connectToDatabase();
    const { priceId } = await params;
    const body = await req.json();
    const {
      name,
      price,
      period,
      expiresPeriodCount,
      description,
      features,
      recommended,
      buttonText,
      buttonVariant,
    } = body as IPrice;

    if (!name || !price || !period || !expiresPeriodCount || !description) {
      return NextResponse.json(
        { error: "Majburiy maydonlar to‘ldirilmagan" },
        { status: 400 }
      );
    }

    const updateData: Partial<IPrice> = {
      name,
      price: Number(price),
      period,
      expiresPeriodCount: Number(expiresPeriodCount),
      description,
      features,
      recommended,
      buttonText,
      buttonVariant,
    };

    const updatedPrice = (await Price.findByIdAndUpdate(priceId, updateData, {
      new: true,
    })) as IPrice;

    // revalidateTag(CacheTags.PRICES);
    // revalidateTag(`${CacheTags.PRICES}-${priceId}`);
    return NextResponse.json(
      {
        message: "Ta'rif muvaffaqiyatli yangilandi",
        success: true,
        data: updatedPrice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /prices error:", error);
    return NextResponse.json({ error: "Server xatoligi" });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  try {
    await connectToDatabase();
    const { priceId } = await params;
    const price = await Price.findByIdAndDelete(priceId);
    if (!price) {
      return NextResponse.json({ error: "Ta'rif topilmadi" }, { status: 404 });
    }
    // revalidateTag(CacheTags.PRICES);
    // revalidateTag(`${CacheTags.PRICES}-${priceId}`);
    return NextResponse.json({ success: true, data: price }, { status: 200 });
  } catch (error) {
    console.error("DELETE /prices error:", error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}
