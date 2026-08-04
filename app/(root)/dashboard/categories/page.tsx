import { serverFetch } from "@/lib/server-fetch";
import CategoriesPageMain from "./_components";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kategoriyalar",
};
const CategoriesPage = async () => {
  const res = await serverFetch(`/api/categories`);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error);
  }

  return <CategoriesPageMain datas={data.datas} />;
};

export default CategoriesPage;
