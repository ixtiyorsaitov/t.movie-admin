import React from "react";
import CommentsPageMain from "./components";
import { getComments } from "@/lib/api/comments";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Izohlar",
};
const limit = 5;

const CommentsPage = async () => {
  const datas = await getComments({ limit, page: 1 });
  if (!datas.success) throw new Error(datas.error);

  return (
    <CommentsPageMain
      limit={limit}
      pagination={datas.pagination}
      datas={datas.datas}
    />
  );
};

export default CommentsPage;
