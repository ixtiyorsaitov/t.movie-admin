import { IEpisode, IGenre } from "@/types";
import { create } from "zustand";

type DeleteStore<T> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: T | null;
  setData: (data: T | null) => void;
};

export const useDeleteEpisode = create<DeleteStore<IEpisode>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));

export const useDeleteGenre = create<DeleteStore<IGenre>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
