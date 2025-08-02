"use client";

import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DataTableDemo } from "./_components/films-datatable";
import { useQuery } from "@tanstack/react-query";
import { IFilm } from "@/types";
import axios from "axios";
import FilmDataTableSkeleton from "./_components/films-datatable-skeleton";

const FilmsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["films"],
    queryFn: async () => {
      const { data } = await axios.get<IFilm[]>("/api/film");

      console.log(data);

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
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
      {isLoading ? (
        <FilmDataTableSkeleton />
      ) : data ? (
        <DataTableDemo films={data} />
      ) : null}
    </div>
  );
};

export default FilmsPage;
