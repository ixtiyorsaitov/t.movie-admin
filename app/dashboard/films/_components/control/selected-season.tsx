import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import EpisodeForm from "./episode-form";
import EpisodeCard from "./episode-card";
import { IEpisode, ISeason } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SelectedSeason = ({
  data,
  filmId,
}: {
  data: ISeason;
  filmId: string;
}) => {
  const [showEpisodeForm, setShowEpisodeForm] = useState<boolean>(false);
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
  const { isLoading } = useQuery({
    queryKey: ["episodes", filmId, data._id],
    queryFn: async () => {
      const { data: response } = await axios.get<IEpisode[]>(
        `/api/film/${filmId}/control/episode?season=${data._id}`
      );

      console.log(response);
      setEpisodes(response);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: data.episodes.length > 0, // ✅ faqat epizodlar mavjud bo‘lsa ishlaydi
  });

  return (
    <div className="rounded-xl border p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">
          Season {data.seasonNumber} Episodes {data.episodes.length}
        </h3>
        <Button onClick={() => setShowEpisodeForm(!showEpisodeForm)}>
          <Plus className="w-4 h-4" />
          <span>Add Episode</span>
        </Button>
      </div>

      {/* Episodes List */}
      {data.episodes.length > 0 ? (
        <div className="space-y-4 mb-6">
          <EpisodeCard />
        </div>
      ) : (
        <div className="text-center py-12">
          <Play className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No seasons yet</h3>
          <p>Add first episode for season {data.seasonNumber}</p>
        </div>
      )}

      {/* Episode Form */}
      {showEpisodeForm && (
        <EpisodeForm
          setEnable={setShowEpisodeForm}
          filmId={filmId}
          seasonId={data._id}
          datas={episodes}
          setDatas={setEpisodes}
        />
      )}
    </div>
  );
};

export default SelectedSeason;
