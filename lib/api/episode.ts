import { IEpisode, PaginationType } from "@/types";
import api from "../axios";
import { CacheTags } from "../utils";
import { IFilm } from "@/types/film";

export async function getEpisodes(filmId: string, limit: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/films/${filmId}/episodes?limit=${limit}`,
    {
      // cache: "force-cache",
      next: {
        tags: [
          CacheTags.ANIME,
          CacheTags.EPISODES,
          `${CacheTags.ANIME}-${filmId}`,
        ],
      },
    }
  );
  const data = await response.json();
  return data as {
    pagination: PaginationType;
    film: IFilm;
    success: boolean;
    error: string;
    datas: IEpisode[];
  };
}

export async function getSearchedEpisodes({
  searchTerm,
  page,
  limit,
  filmId,
}: {
  searchTerm: string;
  page: number;
  limit: number;
  filmId: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/films/${filmId}/episodes?search=${searchTerm}&page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
}

export async function addEpisode({
  episode,
  filmId,
}: {
  episode: object;
  filmId: string;
}) {
  const { data } = await api.post(`/films/${filmId}/episodes`, episode);
  return data;
}

export async function updateEpisode({
  values,
  filmId,
  episodeId,
}: {
  values: object;
  filmId: string;
  episodeId: string;
}) {
  const { data } = await api.put(
    `/films/${filmId}/episodes/${episodeId}`,
    values
  );
  return data;
}

export async function deleteEpisode({
  episodeId,
  filmId,
}: {
  episodeId: string;
  filmId: string;
}) {
  const { data } = await api.delete(`/films/${filmId}/episodes/${episodeId}`);
  return data;
}
