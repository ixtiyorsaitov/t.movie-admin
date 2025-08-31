import { getAnnotations } from "@/lib/api/annotations";
import React from "react";
import AnnotationsPageMain from "./_components";

const AnnotationsPage = async () => {
  const datas = await getAnnotations();
  if (!datas.success) throw new Error(datas.error);

  return <AnnotationsPageMain datas={datas.datas} />;
};

export default AnnotationsPage;
