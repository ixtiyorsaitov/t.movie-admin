import { createReview, getReviews } from "@/lib/api/reviews";
import { CacheTags } from "@/lib/utils";
import { reviewSchema } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const minute = 60 * 1000;
export const useReviews = () => {
  return useQuery({
    queryKey: [CacheTags.REVIEWS],
    queryFn: async () => {
      const res = await getReviews({ page: 1, limit: 10 });
      return res.data;
    },
    // staleTime: minute,
  });
};

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async ({
      values,
      filmId,
    }: {
      values: z.infer<typeof reviewSchema>;
      filmId: string;
    }) => {
      const res = await createReview({ values, filmId });
      return res;
    },
  });
};
