import React from "react";
import UsersMainPage from "./components";
import { serverFetch } from "@/lib/server-fetch";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Foydalanuvchilar",
  description:
    "Foydalanuvchilarni boshqarish (Server jadval funksiyalari orqali)",
};
const limit = 10;

const UsersPage = async () => {
  const res = await serverFetch(`/api/users?limit=${limit}&page=1`);
  const response = await res.json();
  if (!response.success) throw new Error(response.error);

  return (
    <UsersMainPage
      limit={limit}
      pagination={response.pagination}
      datas={response.datas}
    />
  );
};

export default UsersPage;
