"use client";

import { z } from "zod";

export const filmFormSchema = z.object({
  title: z.string().min(5).max(70),
  description: z.string().min(20),
  type: z.string(),
  published: z.boolean(),
});
export const seasonSchema = z.object({
  title: z.string().min(3).max(70),
  number: z.string(),
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
export const genreSchema = z.object({
  name: z.string().min(2, {
    message: "Genre name must be at least 2 characters.",
  }),
});
