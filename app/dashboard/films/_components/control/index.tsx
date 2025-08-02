import { getData } from "../film-view-page";
import { notFound } from "next/navigation";
import SeriesControl from "./series";
import MovieControl from "./movie";

const ControlFilms = async ({ filmId }: { filmId: string }) => {
  const data = await getData(filmId);
  if (!data.success) return notFound();

  return (
    <div className="w-full flex items-center justify-center">
      {data.data.type === "series" ? (
        <SeriesControl data={data.data} />
      ) : (
        <MovieControl data={data.data} />
      )}
    </div>
  );
};

export default ControlFilms;
