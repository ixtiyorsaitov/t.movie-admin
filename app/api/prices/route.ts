import { adminOnly } from "@/lib/admin-only";
import { connectToDatabase } from "@/lib/mongoose";
import { CacheTags } from "@/lib/utils";
import Price from "@/models/price.model";
import { IPrice } from "@/types/price";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const prices = await Price.find().lean();
    return NextResponse.json({ success: true, datas: prices });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" });
  }
}

export async function POST(req: NextRequest) {
  return adminOnly(async () => {
    try {
      await connectToDatabase();
      const reqBody = (await req.json()) as IPrice;
      const body = {
        ...reqBody,
        price: Number(reqBody.price),
        expiresPeriodCount: Number(reqBody.expiresPeriodCount),
      };
      const newPrice = await Price.create(body);
      return NextResponse.json({ success: true, data: newPrice });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server xatosi" });
    }
  });
}
