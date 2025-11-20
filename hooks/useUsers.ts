import {
  createUser,
  deleteUser,
  getSearchedUsers,
  getUserByIdOnlyQuickInfo,
  updateUser,
} from "@/lib/api/users";
import { CacheTags } from "@/lib/utils";
import { IUser, ROLE } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: Partial<IUser>) => await createUser(user),
  });
};
export const useGetSearchedUsers = ({
  searchTerm,
  page,
  limit,
  roleFilter,
  setLoading,
}: {
  searchTerm: string;
  page: number;
  limit: number;
  roleFilter: ROLE | "all";
  setLoading?: (loading: boolean) => void;
}) => {
  return useQuery({
    queryKey: [CacheTags.USERS],
    queryFn: async () =>
      await getSearchedUsers({
        searchTerm,
        page,
        limit,
        roleFilter,
        setLoading,
      }),
  });
};
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (id: string) => await deleteUser(id),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (user: IUser) => await updateUser(user),
  });
};

export const useGetUserByIdOnlyQuickInfo = (id: string | null) => {
  return useQuery({
    queryKey: [CacheTags.USERS, id],
    queryFn: async () => await getUserByIdOnlyQuickInfo(id!),
    enabled: Boolean(id), // <-- faqat id bor bo‘lsa query ishlaydi
    staleTime: Infinity,
  });
};
