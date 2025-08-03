import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import EpisodeForm from "./episode-form";
import EpisodeCard, { EpisodeCardSkeleton } from "./episode-card";
import { IEpisode, IFilm, ISeason } from "@/types";
import axios from "axios";
import { toast } from "sonner";
import { EpisodeDeleteModal } from "@/components/modals/episode.modal";
import SeasonModal from "@/components/modals/season.modal";

const SelectedSeason = ({
  data,
  selectedSeasonId,
  setData,
}: {
  data: IFilm;
  setData: Dispatch<SetStateAction<IFilm>>;
  selectedSeasonId: string;
}) => {
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const [season, setSeason] = useState<ISeason | null>(null);
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
  const [initialEpisodeData, setInitialEpisodeData] = useState<IEpisode | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const selected =
      data.seasons.find((ssn) => ssn._id === selectedSeasonId) || null;
    setSeason(selected);
  }, [selectedSeasonId, data.seasons]);

  useEffect(() => {
    const getDataEpisodes = async () => {
      setLoading(true);
      try {
        if (!selectedSeasonId) return;
        const { data: response } = await axios.get<IEpisode[]>(
          `/api/film/${data._id}/control/episode?season=${selectedSeasonId}`
        );
        setEpisodes(response);
      } catch (error) {
        toast.error("Error with getting episodes");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getDataEpisodes();
  }, [selectedSeasonId]);

  if (!season) return null;

  return (
    <>
      <div className="rounded-xl border p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            Season {season.seasonNumber} Episodes {season.episodes.length}
          </h3>
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={initialEpisodeData !== null && showEpisodeForm}
              onClick={() => {
                setInitialEpisodeData(null);
                setShowEpisodeForm(!showEpisodeForm);
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="sm:flex hidden">Add Episode</span>
            </Button>
            <SeasonModal data={data} setData={setData} initialSeason={season} />
          </div>
        </div>
        {showEpisodeForm && (
          <EpisodeForm
            initialEpisode={initialEpisodeData}
            setEnable={setShowEpisodeForm}
            filmId={data._id}
            seasonId={season._id}
            datas={episodes}
            setDatas={setEpisodes}
          />
        )}
        {episodes.length > 0 ? (
          <div className="space-y-4 mb-6">
            {loading ? (
              <>
                <EpisodeCardSkeleton />
                <EpisodeCardSkeleton />
                <EpisodeCardSkeleton />
              </>
            ) : (
              <>
                {episodes.map((item) => (
                  <EpisodeCard
                    disabled={showEpisodeForm && initialEpisodeData === null}
                    setInitialEpisode={setInitialEpisodeData}
                    setShowEpisodeForm={setShowEpisodeForm}
                    key={item._id}
                    data={item}
                  />
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Play className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No episodes yet</h3>
            <p>Add first episode for season {season.seasonNumber}</p>
          </div>
        )}
      </div>
      <EpisodeDeleteModal setEpisodes={setEpisodes} />
    </>
  );
};

export default SelectedSeason;
