import z from "zod";
import api from "../axios";
import { CacheTags } from "../utils";
import { reviewSchema } from "../validation";

export async function getReviews({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/reviews?page=${page}&limit=${limit}`,
    {
      // cache: "force-cache",
      next: { tags: [CacheTags.REVIEWS] },
    }
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
