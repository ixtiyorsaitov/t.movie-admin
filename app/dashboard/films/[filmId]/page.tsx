import { Suspense } from "react";
import FilmViewPage from "../_components/film-view-page";

export const metadata = {
  title: "Dashboard : Film View",
};

type PageProps = { params: Promise<{ filmId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <div className="flex-1 space-y-4">
      <Suspense fallback={<>Loading...</>}>
        <FilmViewPage filmId={params.filmId} />
      </Suspense>
    </div>
  );
}
