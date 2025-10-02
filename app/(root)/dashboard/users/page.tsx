import React from "react";
import UsersMainPage from "./components";
import { getUsers } from "../../../../lib/api/users";
export const dynamic = "force-dynamic";
const limit = 10;

const UsersPage = async () => {
  const response = await getUsers({ limit, page: 1 });
  if (!response.success) throw new Error(response.error);

  return (
    <UsersMainPage
      limit={limit}
      pagination={response.pagination}
      datas={response.datas}
    />
  );
};

export default UsersPage;
