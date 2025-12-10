import { MembersAction } from "@/actions/members";
import React from "react";
import MembersPageClient from "./components";
const limit = 10;

const MembersPage = async () => {
  const res = await MembersAction.getAll();
  console.log(res);
  if (res.error) throw new Error(res.error);
  return (
    <MembersPageClient
      limit={limit}
      datas={res.datas || []}
      pagination={res.pagination}
    />
  );
};

export default MembersPage;
