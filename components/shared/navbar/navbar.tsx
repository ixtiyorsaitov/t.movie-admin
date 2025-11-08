import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import Breadcrumbs from "../breadcurmbs";
import SearchInput from "./search-input";
import UserNav from "./user-nav";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => {
  return (
    <nav className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="sm:flex hidden">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2 px-4">
        {/* <CtaGithub /> */}
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <ModeToggle />
        {/* <ThemeToggleButton
          variant="gif"
          url="https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s"
        /> */}
        <UserNav />
        {/* <ThemeSelector /> */}
      </div>
    </nav>
  );
};

export default Navbar;
