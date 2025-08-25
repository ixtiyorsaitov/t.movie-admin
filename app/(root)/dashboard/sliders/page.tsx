import HeroSlider from "@/components/core/slider";
import { CacheTags } from "@/lib/utils";
import React from "react";

async function getSliderData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/slider`, {
    cache: "force-cache",
    next: { tags: [CacheTags.SLIDER] },
  });

  if (!res.ok) {
    const errorText = await res.text(); // JSON emas, text bo‘lishi mumkin
    console.error("Slider API error:", errorText);
    return { error: "Failed to fetch slider data" };
  }
  const data = await res.json();

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
