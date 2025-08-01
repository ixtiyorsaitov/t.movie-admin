import { notFound } from "next/navigation";
import FilmForm from "./film-form";

type TProductViewPageProps = {
  filmId: string;
};

export async function getData(filmId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/film/${filmId}`,
    {
      cache: "no-store",
    }
  );
  return res.json();
}

export default async function FilmViewPage({ filmId }: TProductViewPageProps) {
  let film = null;
  let pageTitle = "Create New Product";

  if (filmId !== "new") {
    pageTitle = `Edit Product`;
    const data = await getData(filmId);
    console.log("data", data);

    if (!data) {
      return notFound();
    }
    film = data;
  }

  return <FilmForm initialData={film} pageTitle={pageTitle} />;
}
