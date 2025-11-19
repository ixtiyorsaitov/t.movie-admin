import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth-options";
import { IUser } from "@/types";
export async function authOnly(handler: (user: IUser) => Promise<Response>) {
  const session = await getServerSession(authOptions);

  if (!session?.currentUser) {
    return NextResponse.json(
      { error: "Ro'yhatdan o'tilmagan" },
      { status: 403 }
    );
  }

  return handler(session.currentUser);
}
