import { IEpisode } from "@/types";
import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EpisodeCard({ data }: { data: IEpisode }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
        <span className="text-sm font-medium text-black">
          {data.episodeNumber}
        </span>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{data.title}</h4>
        <p className="text-sm">{data.description}</p>
      </div>
      <Play className="w-5 h-5" />
    </div>
  );
}

// 👇 named export
export function EpisodeCardSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
        <Skeleton className="w-5 h-5 rounded-full bg-gray-300" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-gray-300" />
        <Skeleton className="h-3 w-1/2 bg-gray-300" />
      </div>
      <Skeleton className="w-5 h-5 rounded bg-gray-300" />
    </div>
  );
}
