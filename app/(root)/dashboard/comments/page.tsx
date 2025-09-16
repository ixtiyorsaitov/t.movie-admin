import React from "react";
import { getReviews } from "@/lib/api/reviews";
import CommentsPageMain from "./components";

const limit = 10;

const CommentsPage = async () => {
  const datas = await getReviews({ limit, page: 1 });
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
