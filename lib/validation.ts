import {
  FilmType,
  NotificationSendingType,
  NotificationType,
  PeriodType,
} from "@/types";
import { z } from "zod";

export const filmFormSchemaV1 = z.object({
  title: z.string().min(5).max(70),
  description: z.string().min(20),
  type: z.string(),
  published: z.boolean(),
});
export const filmFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  type: z.nativeEnum(FilmType),
  slug: z.string().optional().or(z.literal("")),
  disableComments: z.boolean(),
  published: z.boolean(),
  genres: z.array(z.string()).min(1, "Kamida 1 ta janr tanlang"),
  actors: z.array(z.string()).min(1, "Kamida 1 ta ovoz aktyorini tanlang"),
  translators: z.array(z.string()).min(1, "Kamida 1 ta tarjimonni tanlang"),
  category: z.string().min(1, "Kategoriyani tanlang"),
});
export const episodeSchmea = z.object({
  title: z.string().min(3).max(70),
  description: z.string().optional(),
  episodeNumber: z.string(),
});
export const deleteSchema = z.object({
  confirmText: z.string().refine((val) => val === "DELETE", {
    message: "You must type 'delete' to confirm.",
  }),
});
export const sliderSchema = z.object({
  id: z.string().min(1, "ID ni kiritng"),
});
export const genreSchema = z.object({
  name: z.string().min(2, {
    message: "Janr kamida 2 ta harfdan iborat bo'lishi kerak",
  }),
});
export const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Janr kamida 2 ta harfdan iborat bo'lishi kerak",
  }),
});
export const newsSchema = z.object({
  title: z.string().min(2, {
    message: "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak`",
  }),
  description: z
    .string()
    .min(20, { message: "Tavsif kamida 20 ta belgidan iborat bo'lishi kerak" }),
  content: z.string().optional(),
  tags: z.array(z.string()).min(1, {
    error: "Iltimos kamida 1 ta teg qo'shing",
  }),
  published: z.boolean(),
  // expireAt: z.date().optional().nullable(), // 👈 Date bo‘ladi
});

export const annotationSchema = z.object({
  subtitle: z.string().min(2, {
    message: "Subtitr kamida 2 ta belgidan iborat bo'lishi kerak`",
  }),
  title: z.string().min(2, {
    message: "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak`",
  }),
  description: z
    .string()
    .min(20, { message: "Tavsif kamida 20 ta belgidan iborat bo'lishi kerak" }),
  ytUrl: z.string().url(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  text: z.string().optional(),
});
export const replyReviewSchema = z.object({
  text: z.string().min(1, { message: "Javobingizni kiriting" }),
  asAdmin: z.boolean(),
});
export const commentSchema = z.object({
  content: z.string().min(3, { message: "Izohingizni kiriting" }),
});
export const replyCommentSchema = z.object({
  content: z.string().min(1, { message: "Javobingizni kiriting" }),
  asAdmin: z.boolean(),
});
export const userSchema = z.object({
  name: z.string().min(2, { message: "Ismini kiriting" }),
  email: z.string().email({ message: "Email formatini kiriting" }),
  role: z.string().min(1, { message: "Rolni kiriting" }),
});
export const priceSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Nomi kamida 5 ta belgidan iborat bo'lishi kerak" }),
  price: z.string().min(0, {
    message: "Narxini kiriting",
  }),
  period: z.enum([PeriodType.MONTHLY, PeriodType.YEARLY], {
    message: "Davrni tanlang",
  }),
  expiresPeriodCount: z.string().min(1, {
    message: "Muddati kamida 1 bo'lishi kerak",
  }),
  description: z
    .string()
    .min(5, { message: "Tavsif kamida 5 ta belgidan iborat bo'lishi kerak" }),
  features: z.array(
    z.object({
      text: z.string().min(2, {
        message: "Tavsif kamida 2 ta belgidan iborat bo'lishi kerak",
      }),
      included: z.boolean(),
    })
  ),
  buttonText: z.string().min(2, {
    message: "Buton teksti kamida 2 ta belgidan iborat bo'lishi kerak",
  }),
  buttonVariant: z.enum(["default", "outline", "secondary"], {
    message: "Buton varianti tanlang",
  }),
  recommended: z.boolean(),
});

export const notificationSchema = z
  .object({
    type: z.enum([
      NotificationType.SYSTEM,
      NotificationType.FILM,
      NotificationType.EPISODE,
      NotificationType.REVIEW_REPLY,
      NotificationType.COMMENT_REPLY,
      NotificationType.PRIVATE,
    ]),
    filmId: z.string().optional(),
    episodeId: z.string().optional(),
    reviewId: z.string().optional(),
    commentId: z.string().optional(),

    title: z.string().min(1, "Sarvlaha majburiy"),
    message: z.string().min(1, "Xabar majburiy"),
    link: z.string().url("Invalid URL").optional().or(z.literal("")),

    sendingType: z.enum([
      NotificationSendingType.ALL,
      NotificationSendingType.USER,
      NotificationSendingType.FILM_SUBSCRIBERS,
      NotificationSendingType.SELECTED_USERS,
    ]),
    sendingFilmId: z.string().optional(),
    sendingUserId: z.string().optional(),
  })
  .refine(
    (data) => {
      // If type is film, filmId is required
      if (data.type === NotificationType.FILM && !data.filmId) {
        return false;
      }
      return true;
    },
    {
      message: "Filmning ID si majburiy film bildirishnomalari uchun",
      path: ["filmId"],
    }
  )
  .refine(
    (data) => {
      // If type is episode, episodeId is required
      if (data.type === NotificationType.EPISODE && !data.episodeId) {
        return false;
      }
      return true;
    },
    {
      message: "Epizodning ID si majburiy epizod bildirishnomalari uchun",
      path: ["episodeId"],
    }
  )
  .refine(
    (data) => {
      // If type is reviewReply, reviewReplyId is required
      if (data.type === NotificationType.REVIEW_REPLY && !data.reviewId) {
        return false;
      }
      return true;
    },
    {
      message: "Sharhning ID si majburiy sharh javobi bildirishnomalari uchun",
      path: ["reviewReplyId"],
    }
  )
  .refine(
    (data) => {
      // If type is commentReply, commentReplyId is required
      if (data.type === NotificationType.COMMENT_REPLY && !data.commentId) {
        return false;
      }
      return true;
    },
    {
      message: "Izohning ID si majburiy izoh javobi bildirishnomalari uchun",
      path: ["commentReplyId"],
    }
  )
  .refine(
    (data) => {
      // If type is private, userId is required
      if (
        data.sendingType === NotificationSendingType.FILM_SUBSCRIBERS &&
        !data.sendingFilmId
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Filmning id sini kiriting agarda uning obunachilariga jo'natmoqchi bo'lsangiz",
      path: ["sendingFilmId"],
    }
  )
  .refine(
    (data) => {
      // If type is private, userId is required
      if (
        data.sendingType === NotificationSendingType.USER &&
        !data.sendingUserId
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Jo'natmoqchi bo'lgan usernig id sini kiriting",
      path: ["sendingUserId"],
    }
  );
