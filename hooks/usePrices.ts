import { createPrice, deletePrice, updatePrice } from "@/lib/api/prices";
import { priceSchema } from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const useCreatePrice = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof priceSchema>) => {
      const res = await createPrice(data);
      return res;
    },
  });
};

export const useUpdatePrice = () => {
  return useMutation({
    mutationFn: async (datas: {
      data: z.infer<typeof priceSchema>;
      priceId: string;
    }) => {
      const res = await updatePrice(datas);
      return res;
    },
  });
};

export const useDeletePriceMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => await deletePrice(id),
  });
};
