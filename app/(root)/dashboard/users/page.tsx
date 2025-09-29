import React from "react";
import UsersMainPage from "./_components";
import { getReviews } from "@/lib/api/reviews";
export const dynamic = "force-dynamic";
const limit = 10;

const UsersPage = async () => {
  const datas = await getReviews({ limit, page: 1 });
  if (!datas.success) throw new Error(datas.error);

  return (
    <UsersMainPage
      limit={limit}
      pagination={datas.pagination}
      datas={datas.datas}
    />
  );
};

export default UsersPage;
