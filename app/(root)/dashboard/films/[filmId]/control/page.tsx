import { FilmType } from "@/types";
import SeriesControl from "../../_components/control/series";
import MovieControl from "../../_components/control/movie";
import { serverFetch } from "@/lib/server-fetch";
const limit = 10;
type PageProps = { params: Promise<{ filmId: string }> };

const ControlPage = async ({ params }: PageProps) => {
  const { filmId } = await params;
  const res = await serverFetch(`/api/films/${filmId}/episodes?limit=${limit}`);
  const data = await res.json();

  if (!data.success) throw new Error(data.error);

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-center">
        {data.film.type === FilmType.SERIES ? (
          <SeriesControl
            limit={limit}
            film={data.film}
            datas={data.datas}
            pagination={data.pagination}
          />
        ) : data.film.type === FilmType.MOVIE ? (
          <MovieControl data={data.film} />
        ) : (
          <div>Film turi aniqlanmagan</div>
        )}
      </div>
    </div>
  );
};

export default ControlPage;
