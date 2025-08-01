import { Play } from "lucide-react";
import React from "react";

const EpisodeCard = () => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
        <span className="text-sm font-medium text-black">1</span>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">Episode number 1</h4>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, at.
        </p>
      </div>
      <Play className="w-5 h-5" />
    </div>
  );
};
export default EpisodeCard;
