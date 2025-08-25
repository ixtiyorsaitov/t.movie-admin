import { getCategories } from "@/lib/api/categories";
import CategoriesPageMain from "./_components";

async function getCategoryData() {
  const data = await getCategories();
  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

const CategoriesPage = async () => {
  const data = await getCategoryData();

  return <CategoriesPageMain datas={data.datas} />;
};

export default CategoriesPage;
