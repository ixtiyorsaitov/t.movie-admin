import { notFound } from "next/navigation";
import FilmForm from "./film-form";
import { FILMS } from "@/lib/constants";

type TProductViewPageProps = {
  filmId: string;
};

export default async function FilmViewPage({ filmId }: TProductViewPageProps) {
  let film = null;
  let pageTitle = "Create New Product";

  if (filmId !== "new") {
    pageTitle = `Edit Product`;
    const findedFilm = FILMS.find((c) => c._id === filmId);
    if (findedFilm) {
      film = findedFilm;
    } else {
      notFound();
    }
  }

  return <FilmForm initialData={film} pageTitle={pageTitle} />;
}
