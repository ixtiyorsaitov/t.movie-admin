import { notFound } from "next/navigation";
import FilmForm from "./film-form";

type TProductViewPageProps = {
  filmId: string;
};

export async function getData(filmId: string) {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/film/${filmId}`,
    {
      cache: "no-store",
      method: "GET",
    }
  );

  const res = await req.json();
  return res;
}

export default async function FilmViewPage({ filmId }: TProductViewPageProps) {
  let film = null;
  let pageTitle = "Create New Product";

  if (filmId !== "new") {
    pageTitle = `Edit Product`;
    const data = await getData(filmId);
    if (!data.success) {
      notFound();
    }
    film = data.data;
  }

  return <FilmForm initialData={film} pageTitle={pageTitle} />;
}
