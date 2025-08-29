"use client";

import React, { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Edit, ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import SliderModal from "@/components/modals/slider.modal";
import z from "zod";
import { ISlider } from "@/types";
import { sliderSchema } from "@/lib/validation";
import { useDeleteSlider, useSliderModal } from "@/hooks/use-slider-modal";
import DeleteSliderModal from "../modals/delete.slider.modal";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function HeroSlider({
  datas: serverDatas,
}: {
  datas: Array<ISlider>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({}, [Autoplay()]);
  const [sliders, setSliders] = useState<Array<ISlider>>(serverDatas);
  const sliderModal = useSliderModal();
  const deleteSlider = useDeleteSlider();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const createMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: res } = await api.post<{
        success: boolean;
        error: string;
        data: ISlider;
      }>("/slider", { id });
      return res;
    },
    onSuccess: (res) => {
      if (res.success) {
        sliderModal.setData(null);
        sliderModal.setOpen(false);
        toast.success("Slider qo'shildi");
        setSliders((prev) => [...prev, res.data]);
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Slider qo'shishda xatolik yuz berdi", {
        description: "Keyinroq urinib ko'ring",
      });
    },
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      filmId,
      sliderId,
    }: {
      filmId: string;
      sliderId: string;
    }) => {
      const { data: res } = await api.put(`/slider/${sliderId}`, { filmId });

      return res;
    },
    onSuccess: (res) => {
      if (res.success) {
        sliderModal.setData(null);
        sliderModal.setOpen(false);
        toast.success("Slider yangilandi");
        setSliders((prev) =>
          prev.map((c) => (c?._id === res.data._id ? res.data : c))
        );
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Sliderni yangilashda xatolik yuz berdi", {
        description: "Keyinroq urinib ko'ring",
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data: res } = await api.delete(
        `/slider/${deleteSlider.data?._id}`
      );

      return res;
    },
    onSuccess: (res) => {
      if (res.success) {
        deleteSlider.setData(null);
        deleteSlider.setOpen(false);
        setSliders((prev) => prev.filter((c) => c._id !== res.data._id));
        toast.success("Slider o'chirildi");
      } else {
        toast.error(res.error);
      }
    },
  });

  const handleSubmit = (values: z.infer<typeof sliderSchema>) => {
    if (sliderModal.data) {
      // Update mutation
      updateMutation.mutate({
        filmId: values.id,
        sliderId: sliderModal.data._id,
      });
    } else {
      createMutation.mutate(values.id);
    }
  };
  const handleDelete = () => {
    if (deleteSlider.data) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="embla w-full max-w-[1600px]">
          <div
            className="embla__veiwport border mt-12 mx-auto h-[70vh] max-h-[600px]"
            ref={emblaRef}
          >
            <div className="embla__container h-full w-full">
              {[...sliders, null].map((item, index) => (
                <div
                  key={index}
                  className="embla__slide flex items-center justify-center w-full h-full"
                >
                  <Slider slider={item} />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex items-center justify-end gap-2 mt-3">
            <Button size={"icon"} className="embla__prev" onClick={scrollPrev}>
              <ArrowLeft />
            </Button>
            <Button size={"icon"} className="embla__next" onClick={scrollNext}>
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
      <SliderModal
        loading={updateMutation.isPending || createMutation.isPending}
        onSubmit={handleSubmit}
      />
      {deleteSlider.data && deleteSlider.open && (
        <DeleteSliderModal loading={false} onDelete={handleDelete} />
      )}
    </>
  );
}

function Slider({ slider }: { slider: ISlider | null }) {
  const sliderModal = useSliderModal();
  const deleteSlider = useDeleteSlider();

  return slider ? (
    <div className="w-full h-full">
      <div className="w-full h-full relative">
        <Image
          src={slider.film.images.backgroundImage.url}
          alt={`Image of ${slider.film.title}`}
          className="object-cover"
          fill
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-start justify-end z-50">
          <div className="space-x-1 mt-1 mr-1">
            <Button
              onClick={() => {
                sliderModal.setData(slider);
                sliderModal.setOpen(true);
              }}
              size="icon"
            >
              <Edit />
            </Button>
            <Button
              onClick={() => {
                deleteSlider.setData(slider);
                deleteSlider.setOpen(true);
              }}
              size="icon"
              variant="destructive"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full h-full">
      <div className="w-full h-full relative flex items-center justify-center flex-col space-y-1">
        <ImageIcon size={50} />
        <p className="text-center">
          {
            "Agar slider qo'shmoqchi bo'lsangiz animening ID sini olib kelib qo'ying"
          }
        </p>
        <Button
          onClick={() => {
            sliderModal.setData(null);
            sliderModal.setOpen(true);
          }}
        >
          {"Slide qo'shish"}
        </Button>
      </div>
    </div>
  );
}
