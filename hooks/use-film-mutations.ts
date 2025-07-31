import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { BUCKETS, type IFilm } from "@/types";
import type { LoadingStep } from "@/types/film-form.types";
import type z from "zod";
import type { filmFormSchema } from "@/lib/validation";
import { removeImage, uploadImage } from "@/lib/supabase-utils";

interface UseFilmMutationsProps {
  initialData: IFilm | null;
  selectedGenres: string[];
  backgroundFile: File | null;
  cardFile: File | null;
  setCreatingStep: (step: LoadingStep) => void;
  setUpdatingStep: (step: LoadingStep) => void;
  onCreateSuccess: () => void;
  onUpdateSuccess: (film: IFilm) => void;
}

export const useFilmMutations = ({
  initialData,
  selectedGenres,
  backgroundFile,
  cardFile,
  setCreatingStep,
  setUpdatingStep,
  onCreateSuccess,
  onUpdateSuccess,
}: UseFilmMutationsProps) => {
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      setCreatingStep(1);

      // Step 1: Create film record
      const { data: createdData } = await axios.post("/api/film", {
        ...values,
        genres: selectedGenres,
      });

      if (!createdData.success) {
        setCreatingStep(null);
        toast.error(createdData.error);
        throw new Error(createdData.error);
      }

      setCreatingStep(2);

      // Step 2: Upload background image
      const uploadBg = await uploadImage(backgroundFile!, BUCKETS.BACKGROUNDS);
      if (!uploadBg.success) {
        setCreatingStep(null);
        toast.error("Something went wrong with upload background image");
        throw new Error("Background upload failed");
      }

      // Step 3: Upload card image
      const uploadImg = await uploadImage(cardFile!, BUCKETS.IMAGES);
      if (!uploadImg.success) {
        setCreatingStep(null);
        toast.error("Something went wrong with upload image");
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

      const { data: finalData } = await axios.put("/api/film", finalFormData);

      if (finalData.success) {
        setCreatingStep("final");
        toast.success("Film created successfully!");

        setTimeout(() => {
          setCreatingStep(null);
          onCreateSuccess();
        }, 2000);
      }

      return finalData;
    },
    onError: (error) => {
      console.error("Create error:", error);
      setCreatingStep(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      if (!initialData) throw new Error("No initial data for update");

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
          toast.error("Error with upload background image");
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
          toast.error("Error with upload image");
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
        `/api/film/${initialData._id}`,
        formData
      );

      if (data.success) {
        setUpdatingStep("final");
        toast.success("Film updated successfully!");

        setTimeout(() => {
          setUpdatingStep(null);
          onUpdateSuccess(data.film);
        }, 2000);
      } else {
        setUpdatingStep(null);
        toast.error(data.error);
        throw new Error(data.error);
      }

      return data;
    },
    onError: (error) => {
      console.error("Update error:", error);
      setUpdatingStep(null);
    },
  });

  return {
    createMutation,
    updateMutation,
    isLoading: createMutation.isPending || updateMutation.isPending,
  };
};
