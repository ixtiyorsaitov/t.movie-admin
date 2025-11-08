import api from "@/lib/axios";
import { fiveMinutes } from "@/lib/constants";
import { CacheTags } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useMembers = (limit: number) => {
  return useQuery({
    queryKey: [CacheTags.MEMBERS],
    queryFn: async () => {
      const {data: res} = await api.get(`/members?limit=${limit}`);
      return res;
    },
    staleTime: fiveMinutes,
  });
};
