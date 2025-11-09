import React from "react";
import ReviewsPageMain from "./_components";
import { getReviews } from "@/lib/api/reviews";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sharhlar",
  description: "Sharhlarni boshqarish (Server jadval funksiyalari orqali)",
};
const limit = 10;

const ReviewsPage = async () => {
  const datas = await getReviews({ limit, page: 1 });
  console.log(datas);

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
