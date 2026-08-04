import { cookies, headers } from "next/headers";

/**
 * Server komponentlarida /api route'larini chaqirish uchun:
 * - Next.js server komponentlarida relative fetch ishlamaydi ("Failed to parse URL")
 * - Session cookie'ni avtomatik uzatadi (adminOnly himoyasi uchun zarur)
 */
export async function serverFetch(path: string, init?: RequestInit) {
  const h = await headers();
  const host = h.get("host") || "localhost:3001";
  const proto = h.get("x-forwarded-proto") || "http";
  const cookie = (await cookies()).toString();

  return fetch(`${proto}://${host}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.headers || {}),
      cookie,
    },
  });
}
