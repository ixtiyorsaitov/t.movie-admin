import { serverFetch } from "@/lib/server-fetch";
import { IFilm } from "@/types/film";
import { FilmFormV2 } from "../_components/film-form-v2";

export const metadata = {
  title: "Dashboard : Film View",
};

type PageProps = { params: Promise<{ filmId: string }> };

export default async function Page(props: PageProps) {
  const { filmId } = await props.params;
  let film: null | IFilm = null;

  if (filmId !== "create") {
    const res = await serverFetch(`/api/films/${filmId}`);
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error);
    }
    film = data.data;
  }
  return (
    <div className="flex-1 space-y-4">
      {/* <FilmForm initialData={film} pageTitle={pageTitle} /> */}
      <FilmFormV2 initialData={film} />
    </div>
  );
}
