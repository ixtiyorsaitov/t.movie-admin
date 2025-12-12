// app/(protected)/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard/overview");
  } else {
    redirect("/auth");
  }
}
