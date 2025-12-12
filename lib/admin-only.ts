import { NextResponse } from "next/server";
import { IUser, ROLE } from "@/types";
import { auth } from "./auth";

export const allowedRoles = [ROLE.ADMIN, ROLE.SUPERADMIN];

export async function adminOnly(handler: (admin: IUser) => Promise<Response>) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Ro'yhatdan o'tilmagan" },
      { status: 403 }
    );
  } else if (!allowedRoles.includes(session.currentUser.role)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 });
  }

  return handler(session.currentUser);
}
