import HeroSlider from "@/components/core/slider";
import { getSliders } from "@/lib/api/sliders";
import { Metadata } from "next";
import React from "react";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Slayder",
};
const Sliders = async () => {
  const datas = await getSliders();
  if (datas.error) throw new Error(datas.error);
  return <HeroSlider datas={datas.datas} />;
};

export default Sliders;
