import FilmForm from "./film-form";
import { getFilmById } from "@/lib/api/films";

type TProductViewPageProps = {
  filmId: string;
};

export default async function FilmViewPage({ filmId }: TProductViewPageProps) {
  let film = null;
  let pageTitle = "Create New Product";

  if (filmId !== "new") {
    pageTitle = `Edit Product`;
    const data = await getFilmById(filmId);
    if (!data.success) {
      throw new Error(data.error);
    }
    film = data.data;
  }

  return <FilmForm initialData={film} pageTitle={pageTitle} />;
}
