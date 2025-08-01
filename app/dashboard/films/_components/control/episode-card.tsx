import { IEpisode } from "@/types";
import { Play } from "lucide-react";
import React from "react";

const EpisodeCard = ({ data }: { data: IEpisode }) => {
  console.log(data);

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
};
export default EpisodeCard;
