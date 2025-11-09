"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  uploadImage,
  createImagePreviewUrl,
  revokeImagePreviewUrl,
  removeImage,
} from "@/lib/supabase-utils";
import { BUCKETS, ImageType } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, PlusIcon, SaveIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Step2Props {
  isEditing: boolean;
  onFinalSubmit: (images: {
    image: ImageType;
    backgroundImage: ImageType;
  }) => void;
  initialImages: {
    image: ImageType | null;
    backgroundImage: ImageType | null;
  };
  setStep: (step: 1 | 2) => void;
  isPending: boolean;
}

const Step2 = ({
  isEditing,
  setStep,
  onFinalSubmit,
  initialImages,
  isPending,
}: Step2Props) => {
  const [sliderFile, setSliderFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  // --- default preview URL larini initialImages dan olamiz ---
  const [sliderPreview, setSliderPreview] = useState<string | null>(
    initialImages.backgroundImage?.url || null
  );
  const [previewPreview, setPreviewPreview] = useState<string | null>(
    initialImages.image?.url || null
  );

  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "slider" | "preview"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = createImagePreviewUrl(file);

    if (type === "slider") {
      if (sliderPreview) revokeImagePreviewUrl(sliderPreview);
      setSliderFile(file);
      setSliderPreview(previewUrl);
    } else {
      if (previewPreview) revokeImagePreviewUrl(previewPreview);
      setPreviewFile(file);
      setPreviewPreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);

      let sliderUrl: string | null = initialImages.backgroundImage?.url || null;
      let previewUrl: string | null = initialImages.image?.url || null;
      let sliderName: string | null =
        initialImages.backgroundImage?.name || null;
      let previewName: string | null = initialImages.image?.name || null;

      if (!sliderFile && !sliderUrl) {
        toast.error("Slider rasmi tanlanmadi");
        return;
      }

      if (!previewFile && !previewUrl) {
        toast.error("Preview rasmi tanlanmadi");
        return;
      }

      if (sliderFile) {
        if (initialImages.backgroundImage) {
          await removeImage(
            [initialImages.backgroundImage.name],
            BUCKETS.BACKGROUNDS
          );
        }
        const res = await uploadImage(sliderFile, BUCKETS.BACKGROUNDS);
        if (res.success && res.url) {
          sliderUrl = res.url;
          sliderName = res.fileName!;
        } else {
          toast.error("Slider rasmini yuklashda xatolik yuz berdi");
          return;
        }
      }

      if (previewFile) {
        if (initialImages.image) {
          await removeImage([initialImages.image.name], BUCKETS.IMAGES);
        }
        const res = await uploadImage(previewFile, BUCKETS.IMAGES);
        if (res.success && res.url) {
          previewUrl = res.url;
          previewName = res.fileName!;
        } else {
          toast.error("Preview rasmini yuklashda xatolik yuz berdi");
          return;
        }
      }

      const imageFormData = {
        image: { url: previewUrl!, name: previewName! },
        backgroundImage: { url: sliderUrl!, name: sliderName! },
      };
      console.log("✅ Uploaded images:", imageFormData);

      onFinalSubmit(imageFormData);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const loading = isUploading || isPending;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slider image */}
        <label className="cursor-pointer rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700 p-6 flex flex-col items-center justify-center text-center relative">
          {sliderPreview ? (
            <div className="relative w-full h-48">
              <Image
                src={sliderPreview}
                alt="Slider Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Slider Image
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                Choose your slider/hero image
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "slider")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        {/* Preview image */}
        <label className="cursor-pointer rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 dark:bg-purple-950 dark:border-purple-700 p-6 flex flex-col items-center justify-center text-center relative">
          {previewPreview ? (
            <div className="relative w-full h-48">
              <Image
                src={previewPreview}
                alt="Preview Thumbnail"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                Preview Image
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                Choose your preview/thumbnail image
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "preview")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1"
          disabled={loading}
        >
          <ArrowLeft />
          Orqaga
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="flex-1"
          disabled={loading}
        >
          {loading ? (
            <>
              {isEditing ? "Saqlanyapti" : "Yaratilyapti"}
              <Spinner />
            </>
          ) : isEditing ? (
            <>
              Saqlash
              <SaveIcon />
            </>
          ) : (
            <>
              Yaratish
              <PlusIcon />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step2;
