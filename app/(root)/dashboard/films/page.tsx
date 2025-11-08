"use client";

import FilmsPageMain from "./_components";
import { useFilms } from "@/hooks/useFilms";
import Loading from "./loading";
const limit = 10;

const FilmsPage = () => {
  const { data: response, isLoading } = useFilms(limit);
  return isLoading ? (
    <Loading />
  ) : (
    <FilmsPageMain
      limit={limit}
      datas={response.datas}
      pagination={response.pagination}
    />
  );
};

export default FilmsPage;
