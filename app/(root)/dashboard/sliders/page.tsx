import HeroSlider from "@/components/core/slider";
import { CacheTags } from "@/lib/utils";
import React from "react";

async function getSliderData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/slider`, {
    next: { tags: [CacheTags.SLIDER] },
  });
  const data = await res.json();
  console.log(data);

  return data;
}

const Sliders = async () => {
  const datas = await getSliderData();
  return datas.error ? (
    <div>{datas.error}</div>
  ) : (
    <HeroSlider datas={datas.datas} />
  );
};

export default Sliders;
