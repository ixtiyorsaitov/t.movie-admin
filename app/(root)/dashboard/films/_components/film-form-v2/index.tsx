"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUCKETS, FilmType, ImageType } from "@/types";
import { IFilm } from "@/types/film";
import Step1 from "./step-1";
import { filmFormSchema } from "@/lib/validation";
import Step2 from "./step-2";
import { useCreateFilmMutation, useUpdateFilmMutation } from "@/hooks/useFilms";
import { toast } from "sonner";
import { removeImage } from "@/lib/supabase-utils";

interface FilmFormProps {
  initialData: IFilm | null;
}

export function FilmFormV2({ initialData }: FilmFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  console.log(initialData);

  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof filmFormSchema>>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          type: initialData.type,
          slug: initialData.slug || "",
          disableComments: initialData.disableComments,
          published: initialData.published,
          genres: initialData.genres.map((g) => g._id || g._id || ""), // 🔥 shu joy muhim
          category: initialData.category?._id,
          actors: initialData.actors.map((a) => a._id || a._id || ""),
          translators: initialData.translators.map((t) => t._id || t._id || ""),
        }
      : {
          title: "",
          description: "",
          type: FilmType.SERIES,
          slug: "",
          disableComments: false,
          published: false,
          genres: [],
          category: "",
          actors: [],
          translators: [],
        },
  });

  const createMutation = useCreateFilmMutation();
  const updateMutation = useUpdateFilmMutation();

  function onFinalSubmit(images: {
    image: ImageType;
    backgroundImage: ImageType;
  }) {
    const values = form.getValues();
    if (isEditing && initialData) {
      updateMutation.mutate(
        { filmId: initialData._id, values: { ...values, images } },
        {
          onSuccess: (response) => {
            console.log("response", response);
            if (response.success) {
              window.location.reload();
              toast.success("Film yaratildi");
            } else {
              toast.error(response.error);
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        { ...values, images },
        {
          onSuccess: async (response) => {
            console.log("response", response);

            if (response.success) {
              window.location.reload();
              toast.success("Film yaratildi");
            } else {
              await removeImage(
                [images.image.name, images.backgroundImage.name],
                BUCKETS.IMAGES
              );
              toast.error(response.error);
            }
          },
        }
      );
    }
  }
  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="w-full py-3">
        <Card className="bg-transparent border-none p-0! shadow-none">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl font-bold">
                {isEditing ? (
                  <>{step === 1 ? "Filmni tahrirlash" : "Rasmni tahrirlash"}</>
                ) : (
                  <>{step === 1 ? "Film qo'shish" : "Rasm qo'shish"}</>
                )}
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <Step1 isPending={loading} form={form} setStep={setStep} />
            ) : (
              <Step2
                setStep={setStep}
                isEditing={isEditing}
                onFinalSubmit={onFinalSubmit}
                isPending={loading}
                initialImages={{
                  image: initialData?.images.image ?? null,
                  backgroundImage: initialData?.images.backgroundImage ?? null,
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
