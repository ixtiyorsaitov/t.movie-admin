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
