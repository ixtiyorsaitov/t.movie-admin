import { PeriodType } from "@/types";
import { z } from "zod";

export const filmFormSchema = z.object({
  title: z.string().min(5).max(70),
  description: z.string().min(20),
  type: z.string(),
  published: z.boolean(),
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
