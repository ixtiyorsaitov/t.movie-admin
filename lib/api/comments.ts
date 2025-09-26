import z from "zod";
import api from "../axios";
import { commentSchema } from "../validation";
import { ReplyFilterTypeComments, SortByTypeComments } from "@/types/comment";
import { Dispatch, SetStateAction } from "react";

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
  content,
  asAdmin,
  filmId,
}: {
  commentId: string;
  content: string;
  asAdmin: boolean;
  filmId: string;
}) {
  const { data } = await api.post(`/comments/${commentId}/reply`, {
    content,
    asAdmin,
    filmId,
  });
  return data;
}

export async function updateReplyComment({
  commentId,
  content,
  asAdmin,
}: {
  commentId: string;
  content: string;
  asAdmin: boolean;
}) {
  const { data } = await api.put(`/comments/${commentId}/reply`, {
    content,
    asAdmin,
  });
  return data;
}

export async function deleteReplyComment(commentId: string) {
  const { data } = await api.delete(`/comments/${commentId}/reply`);
  return data;
}

export const getSearchedComments = async ({
  searchTerm,
  page,
  limit,
  replyFilter,
  sortBy,
  setLoading,
}: {
  searchTerm: string;
  page: number;
  limit: number;
  replyFilter: ReplyFilterTypeComments;
  sortBy: SortByTypeComments;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: res } = await api.get(
    `/comments?search=${searchTerm}&page=${page}&limit=${limit}`
  );

  return res;
};
