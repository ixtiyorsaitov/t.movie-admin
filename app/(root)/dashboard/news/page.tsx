import { CacheTags } from "@/lib/utils";
import React from "react";
import NewsPage from "./_components";

async function getSliderData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/news`, {
    next: { tags: [CacheTags.NEWS] },
  });
  const data = await res.json();
  return data;
}

const NewsServerPage = async () => {
  const datas = await getSliderData();
  console.log(datas);

  return <NewsPage datas={datas.datas} />;
};

export default NewsServerPage;
