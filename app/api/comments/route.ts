import { authOptions } from "@/lib/auth-options";
import { connectToDatabase } from "@/lib/mongoose";
import Comment from "@/models/comment.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const comments = await Comment.find().lean();
    return NextResponse.json(
      { success: true, datas: comments },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { filmId, content } = await req.json();
    const comment = await Comment.create({
      user: session.currentUser._id,
      film: filmId,
      content,
    });
    return NextResponse.json({ success: true, data: comment }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
