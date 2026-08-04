import { cn } from "@/lib/utils";
import React from "react";
import NewsPage from "./_components";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { serverFetch } from "@/lib/server-fetch";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Yangiliklar",
  description: "Yangiliklarni boshqarish (Server jadval funksiyalari orqali)",
};
const limit = 5;
async function getNewsData() {
  // serverFetch — absolute URL + session cookie uzatadi
  const res = await serverFetch(`/api/news?limit=${limit}`);

  if (!res.ok) return null;
  const data = await res.json();

  return data;
}

const NewsServerPage = async () => {
  const datas = await getNewsData();

  if (!datas?.success) return null;

  return (
    <div className="w-full px-2 space-y-3">
      <div className="w-full flex items-center justify-between">
        <Heading
          title="Yangiliklar"
          description="Yangiliklarni boshqarish (Server jadval funksiyalari orqali)"
        />
        <Link href={"/dashboard/news/create"} className={cn(buttonVariants())}>
          <Plus />
          {"Qo'shish"}
        </Link>
      </div>
      <NewsPage
        limit={limit}
        pagination={datas.pagination}
        datas={datas.datas}
      />
    </div>
  );
};

export default NewsServerPage;
