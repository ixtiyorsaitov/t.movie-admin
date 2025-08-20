import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth-options";
import { ROLE } from "@/types";

export const allowedRoles = [ROLE.ADMIN, ROLE.SUPERADMIN];

export async function adminOnly(handler: () => Promise<Response>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  } else if (!allowedRoles.includes(session.currentUser.role)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  return handler();
}
