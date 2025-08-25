import {
  createCategory,
  deleteCategory,
  getCategoryFilms,
  updateCategory,
} from "@/lib/api/categories";
import api from "@/lib/axios";
import { CacheTags } from "@/lib/utils";
import { categorySchema } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const fiveMinutes = 1000 * 60 * 5;

export function useGetCategoryFilms(categoryId?: string) {
  return useQuery({
    queryKey: [
      CacheTags.CATEGORY_FILMS,
      `${CacheTags.CATEGORY_FILMS}-${categoryId}`,
    ],
    queryFn: () => getCategoryFilms(categoryId),
    staleTime: fiveMinutes,
  });
}
export function useCreateCategory() {
  return useMutation({
    mutationFn: (values: z.infer<typeof categorySchema>) =>
      createCategory(values),
  });
}
export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({
      values,
      categoryId,
    }: {
      values: z.infer<typeof categorySchema>;
      categoryId: string;
    }) => updateCategory({ values, categoryId }),
  });
}
export function useDeleteCategoryMutation() {
  return useMutation({
    mutationFn: async (categoryId: string) => deleteCategory(categoryId),
  });
}
