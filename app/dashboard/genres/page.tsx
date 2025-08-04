"use client";

import { IGenre } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import GenresPageMain, { GenresPageMainLoading } from "./_components";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const GenresPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data: response } = await axios.get<IGenre[]>("/api/genre");

      console.log(response);

      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <div className="flex items-start justify-between w-full">
        <Heading
          title="Genres"
          description="Manage genres (Server side table functionalities.)"
        />
        <Link
          href="/dashboard/genres/new"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator className="my-3" />
      {isLoading ? (
        <GenresPageMainLoading />
      ) : data ? (
        <GenresPageMain datas={data} />
      ) : null}
    </div>
  );
};

export default GenresPage;
