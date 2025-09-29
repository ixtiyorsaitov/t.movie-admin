import { ROLE } from "@/types";
import api from "../axios";

export async function getUsers() {
  const { data: res } = await api.get("/users");

  return res;
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
  setLoading: (loading: boolean) => void;
}) => {
  try {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/users?search=${searchTerm}&page=${page}&limit=${limit}&roleFilter=${roleFilter}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: "Ma'lumotlarni olishda xatolik yuz berdi",
      datas: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  } finally {
    setLoading(false);
  }
};
export async function getUser(id: string) {
  const { data: res } = await api.get(`/users/${id}`);

  return res;
}

export async function deleteUser(id: string) {
  const { data: res } = await api.delete(`/users/${id}`);

  return res;
}

export async function updateUser(id: string) {
  const { data: res } = await api.put(`/users/${id}`);

  return res;
}
