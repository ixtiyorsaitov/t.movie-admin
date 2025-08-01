import { Suspense } from "react";
import ControlFilms from "../../_components/control";

type PageProps = { params: Promise<{ filmId: string }> };

const ControlPage = async (props: PageProps) => {
  const params = await props.params;

  return (
    <div className="w-full">
      <Suspense fallback={<>Loading...</>}>
        <ControlFilms filmId={params.filmId} />
      </Suspense>
    </div>
  );
};

export default ControlPage;
