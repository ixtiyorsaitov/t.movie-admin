import { NextResponse } from "next/server";
import { IUser } from "@/types";
import { auth } from "./auth";
export async function authOnly(handler: (user: IUser) => Promise<Response>) {
  const session = await auth();

  if (!session?.currentUser) {
    return NextResponse.json(
      { error: "Ro'yhatdan o'tilmagan" },
      { status: 403 }
    );
  }

  return handler(session.currentUser);
}
