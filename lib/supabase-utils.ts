import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import type { BUCKETS } from "@/types";
import type { ImageUploadResult } from "@/types/film-form.types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const uploadImage = async (
  file: File,
  bucketName: BUCKETS
): Promise<ImageUploadResult> => {
  try {
    const fileName = uuidv4();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return { success: false };
    }

    if (data) {
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      return {
        success: true,
        url: urlData.publicUrl,
        fileName: fileName,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false };
  }
};

export const uploadVideo = async (
  file: File,
  bucket: BUCKETS,
  onProgress?: (progress: number) => void // Added onProgress callback
) => {
  const fileName = `${Date.now()}-${file.name}`;

  // Simulate upload progress for demonstration
  let currentProgress = 0;
  const interval = setInterval(() => {
    currentProgress += 10;
    if (currentProgress <= 90) {
      // Stop before 100 to simulate actual upload finishing
      onProgress?.(currentProgress);
    } else {
      clearInterval(interval);
    }
  }, 100); // Update progress every 100ms

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    clearInterval(interval); // Clear interval on completion
    onProgress?.(100); // Ensure 100% on success

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      return { success: false, error: "Could not get public URL" };
    }

    return { success: true, videoUrl: publicUrlData.publicUrl, fileName };
  } catch (e: any) {
    clearInterval(interval); // Clear interval on error
    onProgress?.(0); // Reset progress on error
    console.error("Upload exception:", e);
    return {
      success: false,
      error: e.message || "An unknown error occurred during upload.",
    };
  }
};

export const removeVideo = async (fileName: string[], bucketName: BUCKETS) => {
  try {
    const { error } = await supabase.storage.from(bucketName).remove(fileName);
    if (error) {
      console.error("Remove error:", error);
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error("Remove error:", error);
    return { success: false };
  }
};
export const removeImage = async (
  fileName: string[],
  bucketName: BUCKETS
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase.storage.from(bucketName).remove(fileName);
    if (error) {
      console.error("Remove error:", error);
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error("Remove error:", error);
    return { success: false };
  }
};

export const createImagePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeImagePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};
