import { getFilmById } from "@/lib/api/films";
import FilmForm from "../_components/film-form";

export const metadata = {
  title: "Dashboard : Film View",
};

type PageProps = { params: Promise<{ filmId: string }> };

export default async function Page(props: PageProps) {
  const { filmId } = await props.params;
  let film = null;
  let pageTitle = "Yangi film qo'shish";

  if (filmId !== "create") {
    pageTitle = `Filmni tahrirlash`;
    const data = await getFilmById(filmId);

    if (!data.success) {
      throw new Error(data.error);
    }
    film = data.data;
  }
  return (
    <div className="flex-1 space-y-4">
      <FilmForm initialData={film} pageTitle={pageTitle} />;
    </div>
  );
}
