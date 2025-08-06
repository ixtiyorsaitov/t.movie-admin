import { create } from "zustand";

type Store = {
  open: boolean;
  setOpen: (open: boolean) => void;
  videoUrl: string | null;
  setVideoUrl: (url: string | null) => void;
};

export const usePlayModal = create<Store>()((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
  videoUrl: null,
  setVideoUrl: (url: string | null) => set({ videoUrl: url }),
}));
