import { notFound } from "next/navigation";
import SeriesControl from "./series";
import MovieControl from "./movie";
import { getFilmById } from "@/lib/api/films";
import { FilmType } from "@/types";

const ControlFilms = async ({ filmId }: { filmId: string }) => {
  const data = await getFilmById(filmId);
  if (!data.success) return notFound();

  return (
    <div className="w-full flex items-center justify-center">
      {data.data.type === FilmType.SERIES ? (
        <SeriesControl data={data.data} />
      ) : (
        <MovieControl data={data.data} />
      )}
    </div>
  );
};

export default ControlFilms;
