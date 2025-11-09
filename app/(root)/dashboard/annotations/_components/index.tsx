"use client";

import {
  AnnotationDeleteModal,
  AnnotationModal,
} from "@/components/modals/annotation.modal";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useAnnotationModal, useDeleteAnnotation } from "@/hooks/use-modals";
import { youTubeEmbed } from "@/lib/utils";
import type { IAnnotation } from "@/types/annotation";
import { EditIcon, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";

const AnnotationsPageMain = ({
  datas: defaultDatas,
}: {
  datas: IAnnotation[];
}) => {
  const [datas, setDatas] = useState<IAnnotation[]>(defaultDatas);
  const annotationModal = useAnnotationModal();
  const deleteModal = useDeleteAnnotation();

  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading title="Annotatsiyalar" description="" />
          <Button
            onClick={() => {
              annotationModal.setData(null);
              annotationModal.setOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
          </Button>
        </div>
        <div className="w-full space-y-4">
          {datas.map((item) => (
            <div
              className="bg-background relative p-4 rounded-lg flex w-full items-center justify-between gap-4 md:flex-row flex-col"
              key={item._id}
            >
              <div className="absolute top-4 md:left-4 md:right-auto right-0 space-x-1">
                <Button
                  size={"icon"}
                  className="size-7"
                  variant={"destructive"}
                  onClick={() => {
                    deleteModal.setData(item);
                    deleteModal.setOpen(true);
                  }}
                >
                  <Trash2 />
                </Button>
                <Button
                  onClick={() => {
                    annotationModal.setData(item);
                    annotationModal.setOpen(true);
                  }}
                  size={"icon"}
                  className="size-7"
                >
                  <EditIcon />
                </Button>
              </div>
              <div className="flex-1 md:w-auto w-full">
                <p className="font-bold text-orange-500">{item.subtitle}</p>
                <h1 className="capitalize text-3xl font-bold mb-2">
                  {item.title}
                </h1>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex-shrink-0 md:w-auto w-full">
                {youTubeEmbed(item.ytUrl).id ? (
                  <iframe
                    width="560"
                    height="315"
                    src={youTubeEmbed(item.ytUrl).url}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-lg md:w-[560px] md:h-[315px] w-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full rounded-lg bg-muted/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Video url topilmadi</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnnotationModal setDatas={setDatas} />
      <AnnotationDeleteModal setDatas={setDatas} />
    </>
  );
};

export default AnnotationsPageMain;
