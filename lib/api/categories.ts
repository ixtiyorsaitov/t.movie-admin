import z from "zod";
import api from "../axios";
import { categorySchema } from "../validation";
import { CacheTags } from "../utils";

export async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/categories`,
    {
      // cache: "force-cache",
      // next: { tags: [CacheTags.CATEGORIES] },
    }
  );
  const data = await res.json();
  return data;
}
export async function getCategoryFilms(categoryId?: string) {
  const { data: response } = await api.get(`/categories/${categoryId}/films`);
  return response;
}
export async function createCategory(values: z.infer<typeof categorySchema>) {
  const { data: response } = await api.post("/categories", values);
  return response;
}
export async function updateCategory({
  values,
  categoryId,
}: {
  values: z.infer<typeof categorySchema>;
  categoryId: string;
}) {
  const { data: response } = await api.put(`/categories/${categoryId}`, values);
  return response;
}
export async function deleteCategory(categoryId: string) {
  const { data: response } = await api.delete(`/categories/${categoryId}`);
  return response;
}
