import { createUser, deleteUser, updateUser } from "@/lib/api/users";
import { IUser } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (user: Partial<IUser>) => await createUser(user),
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
