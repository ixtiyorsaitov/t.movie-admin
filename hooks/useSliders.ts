import { createSlider, deleteSlider, updateSlider } from "@/lib/api/sliders";
import { useMutation } from "@tanstack/react-query";

export const useCreateSliderMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => await createSlider(id),
  });
};

export const useUpdateSliderMutation = () => {
  return useMutation({
    mutationFn: async ({
      sliderId,
      filmId,
    }: {
      sliderId: string;
      filmId: string;
    }) => await updateSlider({ sliderId, filmId }),
  });
};

export const useDeleteSliderMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => await deleteSlider(id),
  });
};
