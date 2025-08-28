"use client";

import { IFilm } from "@/types/film";
import { Plus, Tv } from "lucide-react";
import { useState } from "react";
import VideoPlayModal from "@/components/modals/video-play.modal";
import SelectedSeason from "./selected-season";
import { useEpisodeModal } from "@/hooks/use-modals";
import { EpisodeModal } from "@/components/modals/episode.modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

const SeriesControl = ({ data }: { data: IFilm }) => {
  const [currentData, setCurrentData] = useState<IFilm>(data);
  const episodeModal = useEpisodeModal();
  return (
    <div className="w-full space-y-2 mx-2">
      <div className="w-full flex items-center justify-between">
        <Heading
          title="Seriyalarni boshqarish"
          description="Filmning epizodlarini boshqarish"
        />
        <Button
          onClick={() => {
            episodeModal.setOpen(true);
            episodeModal.setData(null);
          }}
        >
          <Plus />
          {"Qo'shish"}
        </Button>
      </div>

      {/* <SelectedSeason
        data={currentData}
        setData={setCurrentData}
        selectedSeasonId={selectedSeason}
        /> */}
      <EpisodeModal filmId={data._id} />
      <VideoPlayModal />
    </div>
  );
};

export default SeriesControl;
