import { removeImage, uploadImage } from "@/lib/supabase-utils";
import { filmFormSchema } from "@/lib/validation";
import { BUCKETS, IFilm } from "@/types";
import { LoadingStep } from "@/types/film-form.types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import z from "zod";

export const useCreateFilmMutation = ({
  setCreatingStep,
  selectedGenres,
  backgroundFile,
  cardFile,
}: {
  setCreatingStep: (step: LoadingStep) => void;
  selectedGenres: string[];
  backgroundFile: File | null;
  cardFile: File | null;
}) => {
  return useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      const { data: createdData } = await axios.post("/api/films", {
        ...values,
        genres: selectedGenres,
      });

      if (!createdData.success) {
        setCreatingStep(null);
        throw new Error(createdData.error);
      }

      setCreatingStep(2);

      // Step 2: Upload background image
      const uploadBg = await uploadImage(backgroundFile!, BUCKETS.BACKGROUNDS);
      if (!uploadBg.success) {
        setCreatingStep(null);
        throw new Error("Background upload failed");
      }

      // Step 3: Upload card image
      const uploadImg = await uploadImage(cardFile!, BUCKETS.IMAGES);
      if (!uploadImg.success) {
        setCreatingStep(null);
        throw new Error("Card image upload failed");
      }

      setCreatingStep(3);

      // Final step: Update film with images
      const finalFormData = {
        ...values,
        genres: selectedGenres,
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
      };

      const { data: finalData } = await axios.put("/api/films", finalFormData);

      return finalData;
    },
    onError: (error) => {
      console.error("Create error:", error);
      setCreatingStep(null);
    },
  });
};

export const useUpdateFilmMutation = ({
  setUpdatingStep,
  selectedGenres,
  backgroundFile,
  cardFile,
  initialData,
}: {
  setUpdatingStep: (step: LoadingStep) => void;
  selectedGenres: string[];
  backgroundFile: File | null;
  cardFile: File | null;
  initialData: IFilm | null;
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
