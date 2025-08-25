import HeadingSkeleton from "@/components/ui/heading";
import React from "react";
import { GenresPageMainLoading } from "./_components";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <HeadingSkeleton />

      <GenresPageMainLoading />
    </div>
  );
};

export default Loading;
