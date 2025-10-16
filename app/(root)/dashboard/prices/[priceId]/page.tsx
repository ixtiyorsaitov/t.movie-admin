import { IPrice } from "@/types/price";
import React from "react";
import PricePageMain from "../components/price";
import { getPrice } from "@/lib/api/prices";
export const dynamic = "force-dynamic";
const PricePage = async ({
  params,
}: {
  params: Promise<{ priceId: string }>;
}) => {
  const { priceId } = await params;
  let defaultData: null | IPrice = null;
  if (priceId !== "create") {
    const data = await getPrice(priceId);
    if (data.error) throw new Error(data.error);

    defaultData = data.data;
  }

  return <PricePageMain data={defaultData} />;
};

export default PricePage;
