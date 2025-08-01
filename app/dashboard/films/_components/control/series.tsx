"use client";

import SeasonModal from "@/components/modals/season.modal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IFilm } from "@/types";
import { FileVideo, Folder, Play, Plus, Save, Tv, Upload } from "lucide-react";
import { useState } from "react";
import EpisodeForm from "./episode-form";

const SeriesControl = ({ data }: { data: IFilm }) => {
  const [currentData, setCurrentData] = useState<IFilm>(data);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(
    currentData.seasons.length !== 0
      ? currentData.seasons[currentData.seasons.length - 1]._id
      : null
  );
  console.log(currentData);

  const [showEpisodeForm, setShowEpisodeForm] = useState(false);
  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    description: "",
    episodeNumber: 1,
    videoFile: null as File | null,
  });

  // const addEpisode = () => {
  //   if (!selectedSeason || !episodeForm.title || !episodeForm.videoFile) return;

  //   const newEpisode: Episode = {
  //     id: Date.now().toString(),
  //     title: episodeForm.title,
  //     description: episodeForm.description,
  //     episodeNumber: episodeForm.episodeNumber,
  //     videoFile: episodeForm.videoFile,
  //   };

  //   const updatedSeasons = serie.seasons.map((season) => {
  //     if (season.seasonNumber === selectedSeason) {
  //       return { ...season, episodes: [...season.episodes, newEpisode] };
  //     }
  //     return season;
  //   });

  //   setSerie({ ...serie, seasons: updatedSeasons });

  //   // Reset form and keep it open for next episode
  //   setEpisodeForm({
  //     title: "",
  //     description: "",
  //     episodeNumber: episodeForm.episodeNumber + 1,
  //     videoFile: null,
  //   });
  // };

  // const selectedSeasonData = serie.seasons.find(
  //   (s) => s.seasonNumber === selectedSeason
  // );

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
          <SeasonModal data={currentData} setData={setCurrentData} />
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
      {selectedSeason !== null && (
        <div className="rounded-xl border p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Season {10} Episodes</h3>
            <Button onClick={() => setShowEpisodeForm(!showEpisodeForm)}>
              <Plus className="w-4 h-4" />
              <span>Add Episode</span>
            </Button>
          </div>

          {/* Episodes List */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                <span className="text-sm font-medium text-black">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Episode number 1</h4>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Possimus, at.
                </p>
              </div>
              <Play className="w-5 h-5" />
            </div>
          </div>

          {/* Episode Form */}
          {showEpisodeForm && <EpisodeForm setEnable={setShowEpisodeForm} />}
        </div>
      )}
    </div>
  );
};

export default SeriesControl;

const SeasonCardSkeleton = () => {
  return (
    <Skeleton
      className={cn(
        "p-6 rounded-lg border",
        "animate-pulse" // Skeleton styling
      )}
    >
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton
          className={cn(
            "p-2 rounded-lg dark:bg-white/10 bg-black/10",
            "h-9 w-9" // Placeholder for icon background
          )}
        />
        <Skeleton className="h-6 dark:bg-white/10 bg-black/10 rounded w-24" />
        {/* Placeholder for Season title */}
      </div>
      <Skeleton className="h-4 dark:bg-white/10 bg-black/10 rounded w-32" />
      {/* Placeholder for episode count */}
    </Skeleton>
  );
};
