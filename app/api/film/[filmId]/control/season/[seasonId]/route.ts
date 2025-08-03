import { connectToDatabase } from "@/lib/mongoose";
import Season from "@/models/season.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filmId: string; seasonId: string }> }
) {
  try {
    await connectToDatabase();
    const { seasonId } = await params;
    const body = await req.json();
    const { title, number: seasonNumber } = body as {
      title: string;
      number: number;
    };
    const season = await Season.findByIdAndUpdate(
      seasonId,
      {
        title,
        seasonNumber,
      },
      { new: true }
    );
    if (!season) {
      return NextResponse.json({ error: "Season not found", success: false });
    }

    return NextResponse.json({ success: true, data: season });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
