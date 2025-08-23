"use client";

import SearchCommand from "@/components/commands/search-command";
import Navbar from "@/components/shared/navbar/navbar";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import PageLoader from "@/components/ui/page-loader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  return status !== "authenticated" ? (
    <PageLoader />
  ) : (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="md:m-2 !ml-0 md:rounded-md overflow-auto scrollbar-thin bg-sidebar shadow md:border w-full flex items-center md:max-h-[calc(100vh-1rem)] max-h-[100vh]">
          <div className="max-w-[1600px] w-full">
            <Navbar />
            {children}
          </div>
          <SearchCommand />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default BrowseLayout;
