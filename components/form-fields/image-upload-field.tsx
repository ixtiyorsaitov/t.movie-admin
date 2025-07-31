"use client";

import type React from "react";

import { FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface ImageUploadFieldProps {
  label: string;
  description: string;
  previewUrl: string | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  isLoading: boolean;
  className?: string;
  aspectRatio?: string;
  inputId: string;
}

export const ImageUploadField = ({
  label,
  description,
  previewUrl,
  onFileChange,
  onRemove,
  isLoading,
  className,
  aspectRatio = "aspect-video",
  inputId,
}: ImageUploadFieldProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      onFileChange(selectedFile || null);
    },
    [onFileChange]
  );

  return (
    <FormItem className={className}>
      <FormLabel className="text-base font-semibold">{label}</FormLabel>
      <FormDescription className="mb-3">{description}</FormDescription>

      <div
        className={cn(
          "group w-full flex items-center justify-center rounded-lg cursor-pointer relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors",
          aspectRatio
        )}
      >
        {previewUrl && (
          <>
            <Image
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            />
            {!isLoading && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 z-20"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        )}

        {previewUrl && !isLoading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <FormLabel
              htmlFor={inputId}
              className="flex items-center justify-center flex-col space-y-2 border bg-background/90 text-foreground rounded-lg px-6 py-4 cursor-pointer hover:bg-background transition-colors"
            >
              <UploadIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Change Image</span>
            </FormLabel>
          </div>
        )}

        <FormLabel
          htmlFor={inputId}
          className={cn(
            "w-full h-full items-center justify-center cursor-pointer",
            previewUrl ? "hidden" : "flex",
            isLoading && "pointer-events-none opacity-50"
          )}
        >
          {!previewUrl && (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full border-2 border-dashed border-muted-foreground/50 p-4">
                <UploadIcon className="text-muted-foreground w-8 h-8" />
              </div>
              <div>
                <p className="text-muted-foreground font-medium">
                  Upload Image
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Click to browse or drag and drop
                </p>
              </div>
            </div>
          )}
          <Input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
        </FormLabel>
      </div>
    </FormItem>
  );
};
