import { IEpisode, ISeason } from "@/types";
import { create } from "zustand";

type Data = IEpisode | null;

type Store = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Data;
  setData: (data: Data) => void;
};

export const useDeleteEpisode = create<Store>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  data: null,
  setData: (data: Data) => set({ data }),
}));
