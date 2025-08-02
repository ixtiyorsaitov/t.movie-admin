import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import EpisodeForm from "./episode-form";
import EpisodeCard, { EpisodeCardSkeleton } from "./episode-card";
import { IEpisode, IFilm, ISeason } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const SelectedSeason = ({
  data,
  selectedSeasonId,
}: {
  data: IFilm;
  selectedSeasonId: string;
}) => {
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const [season, setSeason] = useState<ISeason | null>(null);
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
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
      } finally {
        setLoading(false);
      }
    };
    getDataEpisodes();
  }, [selectedSeasonId]);
  useEffect(() => {
    console.log("episodes", episodes);
  }, [episodes]);

  if (!season) return null;

  return (
    <div className="rounded-xl border p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">
          Season {season.seasonNumber} Episodes {season.episodes.length}
        </h3>
        <Button onClick={() => setShowEpisodeForm(!showEpisodeForm)}>
          <Plus className="w-4 h-4" />
          <span>Add Episode</span>
        </Button>
      </div>

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
                <EpisodeCard key={item._id} data={item} />
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

      {showEpisodeForm && (
        <EpisodeForm
          setEnable={setShowEpisodeForm}
          filmId={data._id}
          seasonId={season._id}
          datas={episodes}
          setDatas={setEpisodes}
        />
      )}
    </div>
  );
};

export default SelectedSeason;
