import { useMutation, useQuery } from "@tanstack/react-query";
import { CacheTags } from "@/lib/utils";
import { fiveMinutes } from "@/lib/constants";
import {
  createNotification,
  getNotification,
  getNotifications,
} from "@/lib/api/notifications";

export const useNotifications = (limit: number) => {
  return useQuery({
    queryKey: [CacheTags.NOTIFICATIONS],
    queryFn: async () => {
      const res = await getNotifications(limit);
      return res;
    },
    staleTime: fiveMinutes,
  });
};

export const useCreateNotification = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await createNotification(data);
      return res;
    },
  });
};
