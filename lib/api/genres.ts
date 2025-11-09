import z from "zod";
import api from "../axios";
import { genreSchema } from "../validation";
import { SITE_URL } from "../constants";

export async function getGenres() {
  const res = await fetch(`${SITE_URL}/api/genres`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.GENRES] },
  });
  const data = await res.json();
  return data;
}
export async function getGenreFilms(genreId: string) {
  const { data: response } = await api.get(`/genres/${genreId}/films`);
  return response;
}
export async function createGenre(values: z.infer<typeof genreSchema>) {
  const { data: response } = await api.post("/genres", values);
  return response;
}
export async function updateGenre({
  values,
  genreId,
}: {
  values: z.infer<typeof genreSchema>;
  genreId: string;
}) {
  const { data: response } = await api.put(`/genres/${genreId}`, values);
  return response;
}
export async function deleteGenre(genreId: string) {
  const { data: response } = await api.delete(`/genres/${genreId}`);
  return response;
}
