import { serverFetch } from "@/lib/server-fetch";
import GenresPageMain from "./_components";
export const dynamic = "force-dynamic";
async function getGenreData() {
  const res = await serverFetch(`/api/genres`);
  const data = await res.json();
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
