"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageLoader from "@/components/ui/page-loader";
import { ChromeIcon, GithubIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthPage = () => {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard/overview");
    }
  }, [status, router]);

  return status !== "unauthenticated" || loading ? (
    <PageLoader />
  ) : (
    <div className="flex min-h-screen">
      {/* Left Column - Dark Background */}
      <div className="hidden w-1/2 flex-col justify-between bg-black p-8 text-white lg:flex">
        <div className="flex items-center space-x-2">
          <GithubIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Logo</span>
        </div>
        <div className="mb-12">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed">
              {
                ' "This starter template has saved me countless hours of work and helped me deliver projects to my clients faster than ever before." '
              }
            </p>
            <footer className="text-sm">Random Dude</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column - White Background */}
      <div className="relative flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="absolute right-8 top-8 flex items-center space-x-2 text-sm">
          <GithubIcon className="h-4 w-4" />
          <Link href="#" className="hover:underline">
            Star on GitHub
          </Link>
          <span className="text-muted-foreground">★ 4933</span>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Sign in to T.Movies Admin Dashboard
            </CardTitle>
            <CardDescription>
              Welcome back! Please sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Only Google Login Button */}
            <Button
              variant="outline"
              className="w-full"
              aria-label="Login with Google"
              onClick={() => {
                setLoading(true);
                signIn("google");
              }}
            >
              <ChromeIcon className="mr-2 h-5 w-5" />
              Google
            </Button>
          </CardContent>
        </Card>

        <p className="mt-8 px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to {"our "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>
          and
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
