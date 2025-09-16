import z from "zod";
import api from "../axios";
import { commentSchema } from "../validation";

export async function getComments({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/comments?page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
}

export async function createComment({
  values,
  filmId,
}: {
  values: z.infer<typeof commentSchema>;
  filmId: string;
}) {
  const { data } = await api.post("/comments", {
    ...values,
    filmId,
  });
  return data;
}

export async function updateComment({
  values,
  commentId,
}: {
  values: z.infer<typeof commentSchema>;
  commentId: string;
}) {
  const { data } = await api.put(`/comments/${commentId}`, values);
  return data;
}

export async function deleteComment(commentId: string) {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
}

export async function replyComment({
  commentId,
  text,
  asAdmin,
}: {
  commentId: string;
  text: string;
  asAdmin: boolean;
}) {
  const { data } = await api.patch(`/comments/${commentId}/reply`, {
    text,
    asAdmin,
  });
  return data;
}

export async function deleteReplyComment(commentId: string) {
  const { data } = await api.delete(`/comments/${commentId}/reply`);
  return data;
}
