import { IUser, ROLE } from "@/types";
import api from "../axios";
import { SITE_URL } from "../constants";

export async function getUsers({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) {
  const res = await fetch(`${SITE_URL}/api/users?limit=${limit}&page=${page}`);
  const data = await res.json();
  return data;
}
export const getSearchedUsers = async ({
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
  try {
    setLoading?.(true);
    const res = await fetch(
      `${SITE_URL}/api/users?search=${searchTerm}&page=${page}&limit=${limit}&roleFilter=${roleFilter}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return {
      error: "Ma'lumotlarni olishda xatolik yuz berdi",
      datas: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  } finally {
    setLoading?.(false);
  }
};
export async function getUser(id: string) {
  const { data: res } = await api.get(`/users/${id}`);

  return res;
}

export async function createUser(data: Partial<IUser>) {
  const { data: res } = await api.post("/users", data);

  return res;
}

export async function deleteUser(id: string) {
  const { data: res } = await api.delete(`/users/${id}`);

  return res;
}

export async function updateUser(user: IUser) {
  const { data: res } = await api.put(`/users/${user._id}`, user);

  return res;
}
