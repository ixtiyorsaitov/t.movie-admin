import { IEpisode } from "@/types";
import { Play, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

interface Props {
  data: IEpisode;
  disabled: boolean;
  setInitialEpisode: Dispatch<SetStateAction<IEpisode | null>>;
  setShowEpisodeForm: Dispatch<SetStateAction<boolean>>;
}

export default function EpisodeCard({
  data,
  disabled,
  setInitialEpisode,
  setShowEpisodeForm,
}: Props) {
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
      <div className="flex items-center justify-center gap-1">
        <Button
          disabled={disabled}
          variant={"ghost"}
          className="size-7 dark:hover:bg-white/10 hover:bg-black/10"
          size={"icon"}
        >
          <Play className="w-5 h-5" />
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            setInitialEpisode(data);
            setShowEpisodeForm(true);
          }}
          variant={"ghost"}
          className="size-7 dark:hover:bg-white/10 hover:bg-black/10"
          size={"icon"}
        >
          <Settings />
        </Button>
      </div>
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
