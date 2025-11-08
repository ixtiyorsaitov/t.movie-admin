import {
  createGenre,
  deleteGenre,
  getGenreFilms,
  getGenres,
  updateGenre,
} from "@/lib/api/genres";
import api from "@/lib/axios";
import { CacheTags } from "@/lib/utils";
import { genreSchema } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const fiveMinutes = 1000 * 60 * 5;

export const useGenres = () => {
  return useQuery({
    queryKey: [CacheTags.GENRES],
    queryFn: async () => await getGenres(),
    staleTime: fiveMinutes,
  });
};

export function useGetGenreFilms(genreId?: string) {
  return useQuery({
    queryKey: [CacheTags.GENRE_FILMS, `${CacheTags.GENRE_FILMS}-${genreId}`],
    queryFn: () => getGenreFilms(genreId),
    staleTime: fiveMinutes,
  });
}

export function useCreateGenre() {
  return useMutation({
    mutationFn: (values: z.infer<typeof genreSchema>) => createGenre(values),
  });
}
export function useUpdateGenre() {
  return useMutation({
    mutationFn: async ({
      values,
      genreId,
    }: {
      values: z.infer<typeof genreSchema>;
      genreId: string;
    }) => updateGenre({ values, genreId }),
  });
}
export function useDeleteGenreMutation() {
  return useMutation({
    mutationFn: async (genreId: string) => deleteGenre(genreId),
  });
}
