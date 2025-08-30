import { createAnnotation, deleteAnnotation, updateAnnotation } from "@/lib/api/annotations";
import { annotationSchema } from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const useCreateAnnotation = () => {
  return useMutation({
    mutationFn: async (values: z.infer<typeof annotationSchema>) =>
      await createAnnotation(values),
  });
};
export const useUpdateAnnotation = () => {
  return useMutation({
    mutationFn: async ({
      values,
      annotationId,
    }: {
      values: z.infer<typeof annotationSchema>;
      annotationId: string;
    }) => await updateAnnotation({ values, annotationId }),
  });
};

export const useDeleteAnnotationMutation = () => {
  return useMutation({
    mutationFn: async (annotationId: string) =>
      await deleteAnnotation(annotationId),
  });
};
