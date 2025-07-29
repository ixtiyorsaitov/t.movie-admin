"use client";

import { z } from "zod";

export const filmFormSchema = z.object({
  title: z.string().min(5).max(70),
  description: z.string().min(20),
  type: z.string(),
  image: z.any().refine((file) => file instanceof File && file.size > 0, {
    message: "Image file is required",
  }),
  genres: z.array(z.string()),
  published: z.boolean(),
  backgroundImage: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, {
      message: "Image file is required",
    }),
});
