import { IPrice } from "@/types/price";
import React from "react";
import PricePageMain from "../components/price";
import { serverFetch } from "@/lib/server-fetch";
export const dynamic = "force-dynamic";
const PricePage = async ({
  params,
}: {
  params: Promise<{ priceId: string }>;
}) => {
  const { priceId } = await params;
  let defaultData: null | IPrice = null;
  if (priceId !== "create") {
    const res = await serverFetch(`/api/prices/${priceId}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    defaultData = data.data;
  }

  return <PricePageMain data={defaultData} />;
};

export default PricePage;
