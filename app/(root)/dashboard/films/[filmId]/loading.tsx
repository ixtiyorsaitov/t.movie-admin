import React from "react";
import HeadingSkeleton from "@/components/ui/heading";
import FilmFormSkeleton from "../_components/film-form-skeleton";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col space-y-4">
      <FilmFormSkeleton />
    </div>
  );
};

export default Loading;
