"use client";

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
