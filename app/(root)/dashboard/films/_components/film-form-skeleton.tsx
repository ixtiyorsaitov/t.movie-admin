import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const FilmFormSkeleton = () => {
  return (
    <div className="w-full py-3">
      <Card className="bg-transparent border-none p-0! shadow-none">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Title field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Type select */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Actors field */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <div className="flex -space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>

            {/* Translators field */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
              <div className="flex -space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>

            {/* Genres field */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            {/* Category select */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Slug field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Disable comments toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-12" />
            </div>

            {/* Submit button */}
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilmFormSkeleton;
