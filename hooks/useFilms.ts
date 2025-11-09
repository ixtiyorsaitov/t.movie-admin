import { getFilms } from "@/lib/api/films";
import api from "@/lib/axios";
import { removeImage, uploadImage } from "@/lib/supabase-utils";
import { CacheTags } from "@/lib/utils";
import { filmFormSchema } from "@/lib/validation";
import { BUCKETS } from "@/types";
import { IFilm } from "@/types/film";
import { LoadingStep } from "@/types/film-form.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import z from "zod";

const fiveMinutes = 5 * 60 * 1000;

export const useFilms = (limit: number) => {
  return useQuery({
    queryKey: [CacheTags.FILMS],
    queryFn: async () => {
      const res = await getFilms(limit);
      return res;
    },
    staleTime: fiveMinutes,
  });
};

export const useCreateFilmMutation = () => {
  return useMutation({
    mutationFn: async (values: unknown) => {
      const { data: res } = await api.post("/films", values);
      return res;
    },
  });
};
export const useUpdateFilmMutation = () => {
  return useMutation({
    mutationFn: async ({
      values,
      filmId,
    }: {
      values: unknown;
      filmId: string;
    }) => {
      const { data: res } = await api.put(`/films/${filmId}`, values);
      return res;
    },
  });
};

export const useCreateFilmMutationV1 = ({
  setCreatingStep,
  selectedGenres,
  backgroundFile,
  selectedCategory,
  cardFile,
}: {
  setCreatingStep: (step: LoadingStep) => void;
  selectedGenres: string[];
  selectedCategory: string;
  backgroundFile: File | null;
  cardFile: File | null;
}) => {
  return useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      // Step 2: Upload background image
      setCreatingStep(1);
      const uploadBg = await uploadImage(backgroundFile!, BUCKETS.BACKGROUNDS);
      if (!uploadBg.success) {
        setCreatingStep(null);
        throw new Error("Background upload failed");
      }
      setCreatingStep(2);
      // Step 3: Upload card image
      const uploadImg = await uploadImage(cardFile!, BUCKETS.IMAGES);
      if (!uploadImg.success) {
        setCreatingStep(null);
        throw new Error("Card image upload failed");
      }
      setCreatingStep(3);
      const { data: createdData } = await axios.post("/api/films", {
        ...values,
        genres: selectedGenres,
        category: selectedCategory,
        images: {
          backgroundImage: {
            name: uploadBg.fileName,
            url: uploadBg.url,
          },
          image: {
            name: uploadImg.fileName,
            url: uploadImg.url,
          },
        },
      });

      if (!createdData.success) {
        setCreatingStep(null);
        throw new Error(createdData.error);
      }

      return createdData;
    },
    onError: (error) => {
      console.error("Create error:", error);
      setCreatingStep(null);
    },
  });
};

export const useUpdateFilmMutationV1 = ({
  setUpdatingStep,
  selectedGenres,
  backgroundFile,
  cardFile,
  initialData,
  selectedCategory,
}: {
  setUpdatingStep: (step: LoadingStep) => void;
  selectedGenres: string[];
  backgroundFile: File | null;
  cardFile: File | null;
  initialData: IFilm | null;
  selectedCategory: string;
}) => {
  return useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      if (!initialData) throw new Error("Tahrirlanayotgan film yo'q");

      setUpdatingStep(1);

      const backgroundImage = {
        url: initialData.images.backgroundImage.url,
        name: initialData.images.backgroundImage.name,
      };
      const cardImage = {
        url: initialData.images.image.url,
        name: initialData.images.image.name,
      };

      setUpdatingStep(2);

      // Update background image if changed
      if (backgroundFile) {
        await removeImage(
          [initialData.images.backgroundImage.name],
          BUCKETS.BACKGROUNDS
        );
        const uploadedBg = await uploadImage(
          backgroundFile,
          BUCKETS.BACKGROUNDS
        );

        if (uploadedBg.success) {
          backgroundImage.url = uploadedBg.url!;
          backgroundImage.name = uploadedBg.fileName!;
        } else {
          setUpdatingStep(null);
          throw new Error("Background upload failed");
        }
      }

      // Update card image if changed
      if (cardFile) {
        await removeImage([initialData.images.image.name], BUCKETS.IMAGES);
        const uploadedImg = await uploadImage(cardFile, BUCKETS.IMAGES);

        if (uploadedImg.success) {
          cardImage.url = uploadedImg.url!;
          cardImage.name = uploadedImg.fileName!;
        } else {
          setUpdatingStep(null);
          throw new Error("Card image upload failed");
        }
      }

      setUpdatingStep(3);

      const formData = {
        ...initialData,
        ...values,
        genres: selectedGenres,
        category: selectedCategory,
        images: {
          ...initialData.images,
          backgroundImage,
          image: cardImage,
        },
      };

      const { data } = await axios.put(
        `/api/films/${initialData._id}`,
        formData
      );

      return data;
    },
    onError: (error) => {
      console.error("Update error:", error);
      setUpdatingStep(null);
    },
  });
};
