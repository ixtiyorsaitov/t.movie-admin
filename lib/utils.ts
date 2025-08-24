import { PaginationType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CacheTags = {
  SLIDER: "slider",
  NEWS: "news",
  ANIME: "anime",
};

export function formatFileSize(bytes: number): string {
  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (bytes >= gb) {
    return `${(bytes / gb).toFixed(2)} GB`;
  } else if (bytes >= mb) {
    return `${(bytes / mb).toFixed(2)} MB`;
  } else if (bytes >= kb) {
    return `${(bytes / kb).toFixed(2)} KB`;
  } else {
    return `${bytes} B`;
  }
}
export const getPageNumbers = (pagination: PaginationType) => {
  const { page, totalPages } = pagination;
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (page >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "...", page - 1, page, page + 1, "...", totalPages];
};
export function getVideoDuration(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const duration = video.duration;

      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);

      let result = "";
      if (hours > 0) result += `${hours}h `;
      if (minutes > 0) result += `${minutes}min`;
      if (hours === 0 && minutes === 0) result += `${seconds}s`;

      resolve(result.trim());
    };

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
}
