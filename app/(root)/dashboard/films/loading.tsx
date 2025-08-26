import HeadingSkeleton from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import FilmDataTableSkeleton from "./_components/films-datatable-skeleton";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <HeadingSkeleton />

      <Separator className="my-3" />
      <FilmDataTableSkeleton />
    </div>
  );
};

export default Loading;
