"use client";

import { IGenre } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import HeadingSkeleton, { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useCategoryModal } from "@/hooks/use-modals";
import CategoriesPageMain, { CategoriesPageMainLoading } from "./_components";

const CategoriesPage = () => {
  const genreModal = useCategoryModal();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data: response } = await axios.get<IGenre[]>("/api/category");

      return response;
    },
    staleTime: 1000 * 60 * 5,
  });
  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        {isLoading ? (
          <HeadingSkeleton />
        ) : (
          <div className="flex items-start justify-between w-full mb-3">
            <Heading
              title="Kategoriyalar"
              description="Kategoriyalarni boshqarish (Server jadval funksiyalari orqali)"
            />
            <Button
              onClick={() => {
                genreModal.setData(null);
                genreModal.setOpen(true);
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
            </Button>
          </div>
        )}
        {/* <Separator className="my-3" /> */}
        {isLoading ? (
          <CategoriesPageMainLoading />
        ) : data ? (
          <CategoriesPageMain datas={data} />
        ) : null}
      </div>
    </>
  );
};

export default CategoriesPage;
