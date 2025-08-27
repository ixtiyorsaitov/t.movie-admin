"use client";

import { IFilm } from "@/types/film";
import { Tv } from "lucide-react";
import { useState } from "react";
import VideoPlayModal from "@/components/modals/video-play.modal";

const SeriesControl = ({ data }: { data: IFilm }) => {
  const [currentData, setCurrentData] = useState<IFilm>(data);
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
              <h2 className="text-2xl font-semibold">Seriyalarni boshqarish</h2>
              <p>Filmning epizodlarini boshqarish</p>
            </div>
          </div>
        </div>
      </div>

      {/* <SelectedSeason
        data={currentData}
        setData={setCurrentData}
        selectedSeasonId={selectedSeason}
      /> */}
      <VideoPlayModal />
    </div>
  );
};

export default SeriesControl;
