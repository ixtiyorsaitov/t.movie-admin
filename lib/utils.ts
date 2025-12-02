import {
  NotificationSendingType,
  NotificationType,
  PaginationType,
  ROLE,
} from "@/types";
import { clsx, type ClassValue } from "clsx";
import {
  CogIcon,
  FilmIcon,
  LucideIcon,
  MessageCircleIcon,
  MonitorIcon,
  StarIcon,
  TriangleAlertIcon,
  UserLockIcon,
} from "lucide-react";
import slugify from "slugify";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CacheTags = {
  SLIDER: "slider",
  NEWS: "news",
  FILMS: "films",
  EPISODES: "episodes",
  MEMBERS: "members",
  CATEGORIES: "categories",
  GENRES: "genres",
  CATEGORY_FILMS: "category-films",
  GENRE_FILMS: "genre-films",
  ANNOTATION: "annotation",
  REVIEWS: "reviews",
  COMMENTS: "comments",
  USERS: "users",
  PRICES: "prices",
  NOTIFICATIONS: "notifications",
};
export function getLettersOfName(fullName: string): string {
  if (!fullName) return "";

  // So'zlarni bo'lib olish, bo'sh joy bilan split
  const words = fullName.trim().split(/\s+/);

  if (words.length === 1) {
    // Faqat bitta so'z
    return words[0][0].toUpperCase();
  } else {
    // Kamida ikki so'z → birinchi 2 so'zning bosh harfi
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}

export const onCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Nusxalandi");
};
export function youTubeEmbed(url: string) {
  const getVideoId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(url);
  return { url: `https://www.youtube.com/embed/${videoId}`, id: videoId };
}

export function checkRoleIsOriginal(role: ROLE) {
  return role === ROLE.SUPERADMIN || role === ROLE.ADMIN;
}
export function translateRole(role: ROLE) {
  switch (role) {
    case ROLE.SUPERADMIN:
      return "Superadmin";
    case ROLE.ADMIN:
      return "Admin";
    case ROLE.USER:
      return "Oddiy foydalanuvchi";
    default:
      return "Noma'lum";
  }
}

export function generateSlug(title: string) {
  const onlyLettersAndNumbers = true;
  const removeSpecialCharacters = /['".,!?]/g;
  return slugify(title, {
    lower: true,
    strict: onlyLettersAndNumbers,
    remove: removeSpecialCharacters,
  });
}
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

export const defineNotificationType = (type: NotificationType) => {
  switch (type) {
    case NotificationType.FILM:
      return "Film";
    case NotificationType.EPISODE:
      return "Epizod";
    case NotificationType.REVIEW_REPLY:
      return "Sharhga javob";
    case NotificationType.COMMENT_REPLY:
      return "Izohga javob";
    case NotificationType.PRIVATE:
      return "Shaxsiy";
    case NotificationType.SYSTEM:
      return "Tizim";
    default:
      return "Noma'lum";
  }
};

export const defineNotificationSendingType = (
  type: NotificationSendingType
) => {
  switch (type) {
    case NotificationSendingType.ALL:
      return "Barcha foydalanuvchilarga";
    case NotificationSendingType.USER:
      return "Faqat 1 ta foydalanuvchi";
    case NotificationSendingType.FILM_SUBSCRIBERS:
      return "Film obunachilariga";
    case NotificationSendingType.SELECTED_USERS:
      return "Tanlangan foydalanuvchilarga";
    default:
      return "Noma'lum";
  }
};

export const defineNotificationIcon = (type: NotificationType): LucideIcon => {
  switch (type) {
    case NotificationType.FILM:
      return FilmIcon;
    case NotificationType.EPISODE:
      return MonitorIcon;
    case NotificationType.REVIEW_REPLY:
      return StarIcon;
    case NotificationType.COMMENT_REPLY:
      return MessageCircleIcon;
    case NotificationType.PRIVATE:
      return UserLockIcon;
    case NotificationType.SYSTEM:
      return CogIcon;
    default:
      return TriangleAlertIcon;
  }
};
