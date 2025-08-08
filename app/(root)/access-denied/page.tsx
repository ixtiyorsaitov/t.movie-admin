"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PageLoader from "@/components/ui/page-loader";
import { useEffect } from "react";

export default function AccessDenied() {
  const router = useRouter();
  const adminTgUserName = "saitov_next";
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard/overview");
    }
  }, [status, router]);

  return status === "loading" ? (
    <PageLoader />
  ) : (
    <main
      className="w-full grid place-items-center px-4 py-10 h-screen"
      aria-labelledby="access-denied-heading"
    >
      <Card className="w-full max-w-xl shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="destructive" aria-label="HTTP status 403">
              403
            </Badge>
            <CardTitle id="access-denied-heading" className="text-2xl">
              Access denied
            </CardTitle>
          </div>
          <CardDescription>
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-center">
          <Separator />
          <p className="text-sm text-muted-foreground">
            If you would like to test the admin panel, please contact the admin
            on Telegram
          </p>
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Go back
          </Button>

          <Button asChild className="gap-2">
            <Link
              href={`https://t.me/${adminTgUserName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="size-4" aria-hidden="true" />
              Contact admin on Telegram
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
