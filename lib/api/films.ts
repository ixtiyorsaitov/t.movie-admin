const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN_URI!;

export async function getFilms(limit: number) {
  const res = await fetch(`${DOMAIN}/api/films?limit=${limit}`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.FILMS] },
  });
  const data = await res.json();
  return data;
}
export async function getFilmById(filmId: string) {
  const req = await fetch(`${DOMAIN}/api/films/${filmId}`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.FILMS, `${CacheTags.FILMS}-${filmId}`] },
  });

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
    `${DOMAIN}/api/films?search=${searchTerm}&page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
}
