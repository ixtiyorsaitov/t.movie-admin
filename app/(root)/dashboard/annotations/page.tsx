import { serverFetch } from "@/lib/server-fetch";
import React from "react";
import AnnotationsPageMain from "./_components";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Annotatsiyalar",
};
const AnnotationsPage = async () => {
  const res = await serverFetch(`/api/annotations`);
  const datas = await res.json();

  if (!datas.success) throw new Error(datas.error);

  return <AnnotationsPageMain datas={datas.datas} />;
};

export default AnnotationsPage;
