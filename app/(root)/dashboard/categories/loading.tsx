import HeadingSkeleton from "@/components/ui/heading";
import React from "react";
import { CategoriesPageMainLoading } from "./_components";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <HeadingSkeleton />

      <CategoriesPageMainLoading />
    </div>
  );
};

export default Loading;
