import React from "react";
import ReviewsPageMain from "./_components";
import { getReviews } from "@/lib/api/reviews";

const limit = 10;

const ReviewsPage = async () => {
  const datas = await getReviews({ limit, page: 1 });
  if (!datas.success) throw new Error(datas.error);

  return (
    <ReviewsPageMain
      limit={limit}
      pagination={datas.pagination}
      datas={datas.datas}
    />
  );
};

export default ReviewsPage;
