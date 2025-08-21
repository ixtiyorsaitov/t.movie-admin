import { IEpisode, IGenre } from "@/types";
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
