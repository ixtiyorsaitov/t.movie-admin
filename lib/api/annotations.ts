import z from "zod";
import { CacheTags } from "../utils";
import { annotationSchema } from "../validation";
import api from "../axios";

export async function getAnnotations() {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/annotations`,
  //   {
  //     cache: "force-cache",
  //     next: { tags: [CacheTags.ANNOTATION] },
  //   }
  // );
  // const data = await res.json();
  const { data } = await api.get("/annotations");
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
