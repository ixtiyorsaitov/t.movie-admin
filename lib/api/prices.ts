import z from "zod";
import api from "../axios";
import { CacheTags } from "../utils";
import { priceSchema } from "../validation";

export async function getPrices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/prices`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.PRICES] },
  });
  const data = await res.json();
  return data;
}

export async function getPrice(priceId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URI}/api/prices/${priceId}`,
    {
      // cache: "force-cache",
      // next: { tags: [`${CacheTags.PRICES}-${priceId}`] },
    }
  );
  const data = await res.json();
  return data;
}

export async function createPrice(data: z.infer<typeof priceSchema>) {
  const { data: res } = await api.post("/prices", data);
  return res;
}

export async function updatePrice({
  data,
  priceId,
}: {
  data: z.infer<typeof priceSchema>;
  priceId: string;
}) {
  const { data: res } = await api.put(`/prices/${priceId}`, data);
  return res;
}

export async function deletePrice(priceId: string) {
  const { data: res } = await api.delete(`/prices/${priceId}`);
  return res;
}
