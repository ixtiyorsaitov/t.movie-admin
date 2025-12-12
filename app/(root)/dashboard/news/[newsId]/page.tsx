import NewsForm from "./_components/news-form";
import { Heading } from "@/components/ui/heading";
import { INews } from "@/types";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ newsId: string }> };

async function getNewsById(id: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/news/${id}`
    // {
    //   cache: "force-cache",
    //   next: { tags: [CacheTags.NEWS, `${CacheTags.NEWS}-${id}`] },
    // }
  );

  if (!res.ok) return null;
  return res.json();
}

const NewsIdPageServer = async (props: PageProps) => {
  const { newsId } = await props.params;

  let initialData: INews | null = null;

  if (newsId !== "create") {
    const data = await getNewsById(newsId);

    if (!data.success) notFound();
    initialData = data.data;
  }

  return (
    <div className="w-full px-2 space-y-3">
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
