import SearchCommand from "@/components/commands/search-command";
import Navbar from "@/components/shared/navbar/navbar";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="md:m-2 md:ml-0 p-2 md:rounded-md overflow-hidden bg-sidebar shadow border">
          <Navbar />
          {children}
          <SearchCommand />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default BrowseLayout;
