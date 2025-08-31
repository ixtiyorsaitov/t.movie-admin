import HeadingSkeleton from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <HeadingSkeleton />
      <div className="w-full space-y-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-background relative p-4 rounded-lg flex w-full items-center justify-between gap-4 md:flex-row flex-col"
          >
            {/* Action buttons (delete, edit) */}
            <div className="absolute top-4 md:left-4 md:right-auto right-0 space-x-1 flex">
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="size-7 rounded-md" />
            </div>

            {/* Text section */}
            <div className="flex-1 md:w-auto w-full space-y-3">
              <Skeleton className="h-4 w-24" /> {/* subtitle */}
              <Skeleton className="h-8 w-48" /> {/* title */}
              <Skeleton className="h-4 w-full" /> {/* description */}
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Video section */}
            <div className="flex-shrink-0 md:w-auto w-full">
              <Skeleton className="rounded-lg md:w-[560px] md:h-[315px] w-full h-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
