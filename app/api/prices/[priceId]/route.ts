import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import Price from "@/models/price.model";
import { IPrice } from "@/types/price";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { priceId } = await params;
      if (!mongoose.Types.ObjectId.isValid(priceId)) {
        return NextResponse.json(
          { error: "Noto'g'ri ID format" },
          { status: 400 }
        );
      }
      const price = await Price.findById(priceId).lean();
      if (!price) {
        return NextResponse.json({ error: "Ta'rif topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: price });
    } catch (error) {
      console.error("GET /prices error:", error);
      return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { priceId } = await params;
      if (!mongoose.Types.ObjectId.isValid(priceId)) {
        return NextResponse.json(
          { error: "Noto'g'ri ID format" },
          { status: 400 }
        );
      }
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

      if (!updatedPrice) {
        return NextResponse.json(
          { error: "Ta'rif topilmadi" },
          { status: 404 }
        );
      }

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
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ priceId: string }> }
) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const { priceId } = await params;
      if (!mongoose.Types.ObjectId.isValid(priceId)) {
        return NextResponse.json(
          { error: "Noto'g'ri ID format" },
          { status: 400 }
        );
      }
      const price = await Price.findByIdAndDelete(priceId);
      if (!price) {
        return NextResponse.json({ error: "Ta'rif topilmadi" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: price }, { status: 200 });
    } catch (error) {
      console.error("DELETE /prices error:", error);
      return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
    }
  });
}
