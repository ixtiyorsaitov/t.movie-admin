import {
  createReview,
  deleteReplyReview,
  deleteReview,
  getReviews,
  replyReview,
  updateReview,
} from "@/lib/api/reviews";
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

export const useUpdateReview = () => {
  return useMutation({
    mutationFn: async ({
      values,
      reviewId,
    }: {
      values: z.infer<typeof reviewSchema>;
      reviewId: string;
    }) => {
      const res = await updateReview({ values, reviewId });
      return res;
    },
  });
};

export const useDeleteReviewMutation = () => {
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await deleteReview(reviewId);
      return res;
    },
  });
};

export const useReplyReviewMutation = () => {
  return useMutation({
    mutationFn: async ({
      reviewId,
      text,
      asAdmin,
    }: {
      reviewId: string;
      text: string;
      asAdmin: boolean;
    }) => {
      const res = await replyReview({ reviewId, text, asAdmin });
      return res;
    },
  });
};

export const useDeleteReplyReviewMutation = () => {
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await deleteReplyReview(reviewId);
      return res;
    },
  });
};
