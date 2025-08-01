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
