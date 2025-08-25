import { getGenres } from "@/lib/api/genres";
import GenresPageMain from "./_components";

async function getGenreData() {
  const data = await getGenres();
  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

const GenresPage = async () => {
  const data = await getGenreData();

  return <GenresPageMain datas={data.datas} />;
};

export default GenresPage;
