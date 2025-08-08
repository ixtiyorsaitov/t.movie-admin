import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const FilmFormSkeleton = () => {
  return (
    <div className="w-full px-10 pt-5">
      <div className="w-full">
        <Skeleton className="h-8 w-48" />
      </div>
      <Separator className="mt-2 mb-4" />

      <div className="w-full space-y-8">
        {/* Background Image Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="w-full h-[500px] rounded-md" />
        </div>

        {/* Card Image Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="w-full max-w-[300px] h-[400px] rounded-md" />
          <Skeleton className="h-3 w-80" />
        </div>

        {/* Title Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Type Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Genres Button Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description Field Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-[120px] w-full" />
        </div>

        {/* Published Switch Skeleton */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>

        {/* Submit Button Skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default FilmFormSkeleton;
