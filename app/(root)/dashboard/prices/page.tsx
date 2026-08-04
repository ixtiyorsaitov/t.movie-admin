import { serverFetch } from "@/lib/server-fetch";
import React from "react";
import PricesPageMain from "./components/prices";
export const dynamic = "force-dynamic";
const limit = 10;

const PricesPage = async () => {
  const res = await serverFetch(`/api/prices`);
  const response = await res.json();
  if (response.error) throw new Error(response);
  return <PricesPageMain datas={response.datas} limit={limit} />;
};

export default PricesPage;
