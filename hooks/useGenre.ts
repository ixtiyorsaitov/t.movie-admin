import {
  createGenre,
  deleteGenre,
  getGenreFilms,
  updateGenre,
} from "@/lib/api/genres";
import { CacheTags } from "@/lib/utils";
import { genreSchema } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const fiveMinutes = 1000 * 60 * 5;

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
