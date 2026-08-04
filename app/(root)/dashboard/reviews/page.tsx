import React from "react";
import ReviewsPageMain from "./_components";
import { serverFetch } from "@/lib/server-fetch";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sharhlar",
  description: "Sharhlarni boshqarish (Server jadval funksiyalari orqali)",
};
const limit = 10;

const ReviewsPage = async () => {
  const res = await serverFetch(`/api/reviews?limit=${limit}&page=1`);
  const datas = await res.json();

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
