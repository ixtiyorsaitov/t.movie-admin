"use client";

import { IGenre } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import GenresPageMain, { GenresPageMainLoading } from "./_components";
import HeadingSkeleton, { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useGenreModal } from "@/hooks/use-modals";

const GenresPage = () => {
  const genreModal = useGenreModal();
  const { data, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data: response } = await axios.get<IGenre[]>("/api/genre");

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
              title="Janrlar"
              description="Janrlarni boshqarish (Server jadval funksiyalari orqali)"
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
          <GenresPageMainLoading />
        ) : data ? (
          <GenresPageMain datas={data} />
        ) : null}
      </div>
    </>
  );
};

export default GenresPage;
