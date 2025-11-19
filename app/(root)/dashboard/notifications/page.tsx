"use client";

import React from "react";
import NotificationsPageMain from "./components";
import { useNotifications } from "@/hooks/useNotifications";
import Loading from "./loading";
const limit = 10;

const PricesPage = () => {
  const { data: response, isLoading } = useNotifications(limit);
  console.log(response);

  if (response?.error) throw new Error(response.error);
  return isLoading ? (
    <Loading />
  ) : (
    <NotificationsPageMain
      datas={response.datas}
      pagination={response.pagination}
      limit={limit}
    />
  );
};

export default PricesPage;
