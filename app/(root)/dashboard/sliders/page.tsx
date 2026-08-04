import HeroSlider from "@/components/core/slider";
import { serverFetch } from "@/lib/server-fetch";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Slayder",
};
const Sliders = async () => {
  const res = await serverFetch(`/api/sliders`);
  const datas = await res.json();
  if (datas.error) throw new Error(datas.error);
  return <HeroSlider datas={datas.datas} />;
};

export default Sliders;
