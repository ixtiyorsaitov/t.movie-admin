import {
  createComment,
  deleteComment,
  deleteReplyComment,
  getComments,
  replyComment,
  updateComment,
} from "@/lib/api/comments";
import { CacheTags } from "@/lib/utils";
import { commentSchema } from "@/lib/validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const minute = 60 * 1000;
export const useComments = () => {
  return useQuery({
    queryKey: [CacheTags.COMMENTS],
    queryFn: async () => {
      const res = await getComments({ page: 1, limit: 10 });
      return res.data;
    },
    // staleTime: minute,
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: async ({
      values,
      filmId,
    }: {
      values: z.infer<typeof commentSchema>;
      filmId: string;
    }) => {
      const res = await createComment({ values, filmId });
      return res;
    },
  });
};

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: async ({
      values,
      commentId,
    }: {
      values: z.infer<typeof commentSchema>;
      commentId: string;
    }) => {
      const res = await updateComment({ values, commentId });
      return res;
    },
  });
};

export const useDeleteCommentMutation = () => {
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await deleteComment(commentId);
      return res;
    },
  });
};

export const useReplyCommentMutation = () => {
  return useMutation({
    mutationFn: async ({
      commentId,
      text,
      asAdmin,
    }: {
      commentId: string;
      text: string;
      asAdmin: boolean;
    }) => {
      const res = await replyComment({ commentId, text, asAdmin });
      return res;
    },
  });
};

export const useDeleteReplyCommentMutation = () => {
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await deleteReplyComment(commentId);
      return res;
    },
  });
};
