import { getCategories } from "@/lib/api/categories";
import CategoriesPageMain from "./_components";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kategoriyalar",
};
const CategoriesPage = async () => {
  const data = await getCategories();
  if (!data.success) {
    throw new Error(data.error);
  }

  return <CategoriesPageMain datas={data.datas} />;
};

export default CategoriesPage;
