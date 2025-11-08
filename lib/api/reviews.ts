import z from "zod";
import api from "../axios";
import { reviewSchema } from "../validation";

export async function getReviews({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/reviews?page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
}

export async function createReview({
  values,
  filmId,
}: {
  values: z.infer<typeof reviewSchema>;
  filmId: string;
}) {
  const { data } = await api.post("/reviews", {
    ...values,
    filmId,
    rating: values.rating * 2,
  });
  return data;
}

export async function updateReview({
  values,
  reviewId,
}: {
  values: z.infer<typeof reviewSchema>;
  reviewId: string;
}) {
  const { data } = await api.put(`/reviews/${reviewId}`, {
    ...values,
    rating: values.rating * 2,
  });
  return data;
}

export async function deleteReview(reviewId: string) {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
}

export async function replyReview({
  reviewId,
  text,
  asAdmin,
}: {
  reviewId: string;
  text: string;
  asAdmin: boolean;
}) {
  const { data } = await api.patch(`/reviews/${reviewId}/reply`, {
    text,
    asAdmin,
  });
  return data;
}

export async function deleteReplyReview(reviewId: string) {
  const { data } = await api.delete(`/reviews/${reviewId}/reply`);
  return data;
}
