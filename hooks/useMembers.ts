import { MembersAction } from "@/actions/members";
import api from "@/lib/axios";
import { fiveMinutes } from "@/lib/constants";
import { CacheTags } from "@/lib/utils";
import { MemberType } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMembers = (limit: number) => {
  return useQuery({
    queryKey: [CacheTags.MEMBERS],
    queryFn: async () => {
      const { data: res } = await api.get(`/members?limit=${limit}`);
      return res;
    },
    staleTime: fiveMinutes,
  });
};

export const useCreateMember = () => {
  return useMutation({
    mutationFn: async (values: { userId: string; type: MemberType[] }) => {
      const res = await MembersAction.create(values);
      return res;
    },
  });
};

export const useUpdateMember = () => {
  return useMutation({
    mutationFn: async (values: {
      userId: string;
      type: MemberType[];
      memberId: string;
    }) => {
      const res = await MembersAction.update(values);
      return res;
    },
  });
};

export const useDeleteMemberMutation = () => {
  return useMutation({
    mutationFn: async (memberId: string) => {
      const res = await MembersAction.delete(memberId);
      return res;
    },
  });
};
