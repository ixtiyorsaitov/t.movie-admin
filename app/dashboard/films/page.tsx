import Title from "@/components/shared/title";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus, PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DataTableDemo } from "./_components/films-datatable";

const FilmsPage = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <div className="flex items-start justify-between w-full">
        <Heading
          title="Products"
          description="Manage products (Server side table functionalities.)"
        />
        <Link
          href="/dashboard/films/new"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator className="my-3" />
      <DataTableDemo />
    </div>
  );
};

export default FilmsPage;
