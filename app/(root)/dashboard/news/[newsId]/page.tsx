import React from "react";
import NewsForm from "./_components/news-form";
import { INews } from "@/types";
import { Heading } from "@/components/ui/heading";
import { CacheTags } from "@/lib/utils";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ newsId: string }> };

async function getNewsById(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/news/${id}`,
    {
      next: { tags: [CacheTags.NEWS, id] },
    }
  );
  const data = await res.json();
  return data;
}


const NewsIdPageServer = async (props: PageProps) => {
  const { newsId } = await props.params;
  let initialData: null | INews = null;
  if (newsId !== "create") {
    const data = await getNewsById(newsId);
    if (data.error) {
      notFound();
    }
    initialData = data.data;
  }

  return (
    <div className="w-full px-2">
      <Heading
        title={initialData ? "Yangilikni o'zgartirish" : "Yangilik qo'shish"}
        description={
          initialData
            ? "Kerakli maydonlarni to'ldirib yangilikni o'zgartiring"
            : "Kerakli maydonlarni to'ldirib yangilik yarating"
        }
      />
      <NewsForm initialData={initialData} />
    </div>
  );
};

export default NewsIdPageServer;
