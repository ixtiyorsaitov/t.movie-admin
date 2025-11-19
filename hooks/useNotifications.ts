import { useQuery } from "@tanstack/react-query";
import { CacheTags } from "@/lib/utils";
import { fiveMinutes } from "@/lib/constants";
import { getNotifications } from "@/lib/api/notifications";

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
