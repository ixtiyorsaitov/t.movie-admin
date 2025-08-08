"use client";

import SeasonModal from "@/components/modals/season.modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IFilm } from "@/types";
import { Folder, Tv } from "lucide-react";
import { useState } from "react";
import SelectedSeason from "./selected-season";
import VideoPlayModal from "@/components/modals/video-play.modal";

const SeriesControl = ({ data }: { data: IFilm }) => {
  const [currentData, setCurrentData] = useState<IFilm>(data);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(
    currentData.seasons.length !== 0
      ? currentData.seasons[currentData.seasons.length - 1]._id
      : null
  );
  return (
    <div className="w-full space-y-2 mx-2">
      {/* Seasons Overview */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent rounded-lg">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Serie Management</h2>
              <p>Manage seasons and episodes</p>
            </div>
          </div>
          <SeasonModal
            initialSeason={null}
            data={currentData}
            setData={setCurrentData}
          />
        </div>

        {currentData?.seasons?.length <= 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No seasons yet</h3>
            <p>Create your first season to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData?.seasons?.map((season) => (
              <div
                key={season._id}
                onClick={() => setSelectedSeason(season._id)}
                className={`p-6 rounded-lg cursor-pointer transition-all duration-200 border ${
                  selectedSeason === season._id
                    ? "bg-primary text-white dark:text-black"
                    : "text-black dark:text-white"
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      selectedSeason === season._id ? "bg-background" : ""
                    )}
                  >
                    <Folder className="w-5 h-5 dark:text-white text-black" />
                  </div>
                  <h3>{season.title}</h3>
                </div>
                <p>
                  {season.episodes.length} episode
                  {season.episodes.length > 1 && "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Season Details */}
      {selectedSeason !== null &&
        currentData.seasons.some((ssn) => ssn._id === selectedSeason) && (
          <SelectedSeason
            data={currentData}
            setData={setCurrentData}
            selectedSeasonId={selectedSeason}
          />
        )}
      <VideoPlayModal />
    </div>
  );
};

export default SeriesControl;

// const SeasonCardSkeleton = () => {
//   return (
//     <Skeleton
//       className={cn(
//         "p-6 rounded-lg border",
//         "animate-pulse" // Skeleton styling
//       )}
//     >
//       <div className="flex items-center space-x-3 mb-3">
//         <Skeleton
//           className={cn(
//             "p-2 rounded-lg dark:bg-white/10 bg-black/10",
//             "h-9 w-9" // Placeholder for icon background
//           )}
//         />
//         <Skeleton className="h-6 dark:bg-white/10 bg-black/10 rounded w-24" />
//         {/* Placeholder for Season title */}
//       </div>
//       <Skeleton className="h-4 dark:bg-white/10 bg-black/10 rounded w-32" />
//       {/* Placeholder for episode count */}
//     </Skeleton>
//   );
// };
