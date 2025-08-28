import { IEpisode } from "@/types";
import api from "../axios";

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
  episode,
  filmId,
}: {
  episode: IEpisode;
  filmId: string;
}) {
  const { data } = await api.put(`/films/${filmId}/episodes`, episode);
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
