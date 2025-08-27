import { CacheTags } from "../utils";

export async function getFilms(limit: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/films?limit=${limit}`,
    {
      // cache: "force-cache",
      next: { tags: [CacheTags.ANIME] },
    }
  );
  const data = await res.json();
  return data;
}
export async function getFilmById(filmId: string) {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/films/${filmId}`,
    {
      // cache: "force-cache",
      next: { tags: [CacheTags.ANIME, `${CacheTags.ANIME}-${filmId}`] },
    }
  );

  const res = await req.json();
  return res;
}
export async function getSearchedFilms({
  searchTerm,
  page,
  limit,
}: {
  searchTerm: string;
  page: number;
  limit: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/films?search=${searchTerm}&page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
}
