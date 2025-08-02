import SearchCommand from "@/components/commands/search-command";
import Navbar from "@/components/shared/navbar/navbar";
import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset
          className="md:ml-0 m-2 md:rounded-md overflow-auto bg-sidebar shadow border w-full flex items-center"
          style={{ maxHeight: "calc(100vh - 1rem)" }} // 1rem = m-2 (2*0.5rem)
        >
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
