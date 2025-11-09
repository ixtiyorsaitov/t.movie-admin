import z from "zod";
import { annotationSchema } from "../validation";
import api from "../axios";
import { SITE_URL } from "../constants";

export async function getAnnotations() {
  const res = await fetch(`${SITE_URL}/api/annotations`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.ANNOTATION] },
  });
  const data = await res.json();

  return data;
}

export async function createAnnotation(
  values: z.infer<typeof annotationSchema>
) {
  const { data } = await api.post("/annotations", values);
  return data;
}

export async function updateAnnotation({
  annotationId,
  values,
}: {
  values: z.infer<typeof annotationSchema>;
  annotationId: string;
}) {
  const { data } = await api.put(`/annotations/${annotationId}`, values);
  return data;
}

export async function deleteAnnotation(annotationId: string) {
  const { data } = await api.delete(`/annotations/${annotationId}`);
  return data;
}
