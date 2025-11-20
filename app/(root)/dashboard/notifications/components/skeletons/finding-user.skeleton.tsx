import React from "react";

const FindingUserSkeleton = () => {
  return (
    <div className="flex items-center justify-start gap-2">
      {/* Avatar skeleton */}
      <div className="w-11 h-11 rounded-full bg-muted animate-pulse" />

      {/* Text skeletons */}
      <div className="flex flex-col gap-1">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};

export default FindingUserSkeleton;
