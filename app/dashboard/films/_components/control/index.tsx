import { IFilm } from "@/types";
import { getData } from "../film-view-page";
import { notFound } from "next/navigation";
import SeriesControl from "./series";
import MovieControl from "./movie";

const ControlFilms = async ({ filmId }: { filmId: string }) => {
  const data = (await getData(filmId)) as IFilm;
  if (!data) return notFound();

  return (
    <div className="w-full flex items-center justify-center">
      {data.type === "series" ? (
        <SeriesControl data={data} />
      ) : (
        <MovieControl data={data} />
      )}
    </div>
  );
};

export default ControlFilms;
