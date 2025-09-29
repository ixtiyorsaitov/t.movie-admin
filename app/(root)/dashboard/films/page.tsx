import { getFilms } from "@/lib/api/films";
import FilmsPageMain from "./_components";
export const dynamic = "force-dynamic";
const limit = 2;

async function getFilmsData() {
  const data = await getFilms(limit);
  if (!data.success) {
    throw new Error(data.error);
  }
  return data;
}

const FilmsPage = async () => {
  const data = await getFilmsData();
  return (
    <FilmsPageMain
      limit={limit}
      datas={data.datas}
      pagination={data.pagination}
    />
  );
};

export default FilmsPage;
