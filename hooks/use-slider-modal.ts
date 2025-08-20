import { ISlider } from "@/types";
import { create } from "zustand";

type ModalStore<T> = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: T | null;
  setData: (data: T | null) => void;
};

export const useDeleteSlider = create<ModalStore<ISlider>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
export const useSliderModal = create<ModalStore<ISlider>>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  data: null,
  setData: (data) => set({ data }),
}));
