import api from "../axios";

export async function getFilms(limit: number) {
  const res = await fetch(`/api/films?limit=${limit}`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.FILMS] },
  });
  const data = await res.json();
  return data;
}
export async function getFilmById(filmId: string) {
  const req = await fetch(`/api/films/${filmId}`, {
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
    `/api/films?search=${searchTerm}&page=${page}&limit=${limit}`
  );
  const data = await res.json();
  return data;
}

export async function getFilmByIdOnlyQuickInfo(filmId: string) {
  const { data: res } = await api.get(`/films/${filmId}/quickInfo`);
  return res;
}
