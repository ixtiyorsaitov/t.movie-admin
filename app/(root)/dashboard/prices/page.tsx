import { getPrices } from "@/lib/api/prices";
import React from "react";
import PricesPageMain from "./components/prices";
export const dynamic = "force-dynamic";
const limit = 10;

const PricesPage = async () => {
  const response = await getPrices();
  if (response.error) throw new Error(response);
  return <PricesPageMain datas={response.datas} limit={limit} />;
};

export default PricesPage;
