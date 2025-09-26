import { IEpisode, IGenre, INews } from "@/types";
import { IAnnotation } from "@/types/annotation";
import { IComment } from "@/types/comment";
import { IReview } from "@/types/review";
import { create } from "zustand";

type ModalStore<T> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: T | null;
  setData: (data: T | null) => void;
};

export const useEpisodeModal = create<ModalStore<IEpisode>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteEpisode = create<ModalStore<IEpisode>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));

export const useGenreModal = create<ModalStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useGenreFilmsModal = create<ModalStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));

export const useDeleteGenre = create<ModalStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));

export const useCategoryModal = create<ModalStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useCategoryFilmsModal = create<ModalStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));

export const useDeleteCategory = create<ModalStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteNews = create<ModalStore<INews>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useAnnotationModal = create<ModalStore<IAnnotation>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteAnnotation = create<ModalStore<IAnnotation>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useReviewModal = create<ModalStore<IReview>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteReview = create<ModalStore<IReview>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useReviewReplyModal = create<ModalStore<IReview>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteRepliedReview = create<ModalStore<IReview>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useCommentModal = create<ModalStore<IComment>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteComment = create<ModalStore<IComment>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useCommentReplyModal = create<ModalStore<IComment>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useDeleteRepliedComment = create<ModalStore<IComment>>()(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
    data: null,
    setData: (data) => set({ data }),
  })
);
