"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileVideo, Loader2, Save, Trash, Trash2, Upload } from "lucide-react";

import { useDeleteEpisode, useEpisodeModal } from "@/hooks/use-modals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { removeVideo } from "@/lib/supabase-utils";
import { BUCKETS, IEpisode } from "@/types";
import { deleteSchema, episodeSchmea } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  useAddEpisode,
  useDeleteEpisodeMutation,
  useUpdateEpisode,
} from "@/hooks/useEpisode";

export function DeleteEpisodeModal({
  setEpisodes,
  filmId,
}: {
  filmId: string;
  setEpisodes: Dispatch<SetStateAction<IEpisode[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteEpisode();

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });
  const deleteMutation = useDeleteEpisodeMutation(filmId);

  // Reset form when the modal opens/closes
  useEffect(() => {
    if (!open) {
      setData(null);
      form.reset(); // Reset form fields and errors
    }
  }, [open, setData, form]);

  const onSubmit = async () => {
    if (data) {
      deleteMutation.mutate(
        {
          episodeId: data?._id,
          videoName: data?.video.name,
        },
        {
          onSuccess: (res) => {
            console.log(res);

            if (res.success) {
              setEpisodes((prev) => prev.filter((d) => d._id !== data?._id));
              form.reset();
              setData(null);
              setOpen(false);
              toast.success("Epizod o'chirildi");
            } else {
              toast.error(res.error);
            }
          },
        }
      );
    }
  };

  return (
    open &&
    data != null && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Siz aniq bu epizod ni {"o'chirmoqchimisiz"} {`"${data.title}"`}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bu operatsiyani orqaga qaytarib {"bo'lmaydi"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="confirmText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tasdiqlash uchun, pastga{" "}
                      <span className="font-bold text-destructive">
                        {"'DELETE'"}
                      </span>
                      deb yozing:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={deleteMutation.isPending}
                        placeholder="DELETE deb yozing"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-end gap-1">
                <Button
                  variant={"secondary"}
                  disabled={deleteMutation.isPending}
                  type="button"
                  onClick={() => {
                    setData(null);
                    setOpen(false);
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  disabled={deleteMutation.isPending}
                  type="submit"
                  variant={"destructive"}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash />
                  )}
                  {"O'chirish"}
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}

export const EpisodeModal = ({
  filmId,
  setDatas,
}: {
  filmId: string;
  setDatas: Dispatch<SetStateAction<IEpisode[]>>;
}) => {
  const { open, setOpen, data, setData } = useEpisodeModal();
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof episodeSchmea>>({
    resolver: zodResolver(episodeSchmea),
    defaultValues: {
      title: "",
      description: "",
      episodeNumber: "",
    },
  });

  // data o'zgarganda formni yangilash
  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        description: data.description,
        episodeNumber: String(data.episodeNumber),
      });
    } else {
      form.reset({
        title: "",
        description: "",
        episodeNumber: "",
      });
    }
  }, [data, form]);

  const addMutation = useAddEpisode({ filmId, videoFile });
  const updateMutation = useUpdateEpisode({ filmId, videoFile });
  function onSubmit(values: z.infer<typeof episodeSchmea>) {
    if (data) {
      updateMutation.mutate(
        { values, oldVideoName: data.video.name, episodeId: data._id },
        {
          onSuccess: (res) => {
            if (res.success) {
              setDatas((prev) =>
                prev.map((d) => (d._id === res.data._id ? res.data : d))
              );
              toast.success("Epizod muvafaqqiyatli yangilandi!");
              form.reset();
              setData(null);
              setOpen(false);
              setVideoFile(null);
            } else {
              toast.error(res.error);
            }
          },
        }
      );
    } else {
      if (!videoFile) {
        return toast.error("Xatolik", {
          description: "Iltimos qurilmangizdan videoni tanlang",
        });
      }
      addMutation.mutate(values, {
        onSuccess: (res) => {
          if (res.success) {
            setDatas((prev) => [res.data, ...prev]);
            toast.success("Epizod muvafaqqiyatli qo'shildi!");
            form.reset();
            setData(null);
            setOpen(false);
            setVideoFile(null);
          } else {
            toast.error(res.error);
          }
        },
      });
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogTitle />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h4 className="text-lg font-medium mb-4">
              {data ? "Epizodni yangilash" : "Epizod qo'shish"}
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="episodeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Epizod raqami</FormLabel>
                        <FormControl>
                          <Input
                            disabled={addMutation.isPending}
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Epizod nomini</FormLabel>
                        <FormControl>
                          <Input
                            disabled={addMutation.isPending}
                            placeholder="Epizod nomini kiriting..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Epizod tavsifi</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={addMutation.isPending}
                          placeholder="Epizod tavsifini kiriting..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <Label className="mb-2">Video fayl</Label>
                <Label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                  <div className="text-center">
                    {videoFile ? (
                      <div className="space-y-2">
                        <FileVideo className="w-8 h-8 mx-auto" />
                        <p className="text-sm font-medium">{videoFile.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto" />
                        <p className="text-sm">Yuklash uchun bosing</p>
                      </div>
                    )}
                  </div>
                  {!addMutation.isPending && (
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideoFile(file);
                        }
                      }}
                    />
                  )}
                </Label>
              </div>

              <div className="flex justify-end space-x-3 sm:flex-row flex-col-reverse">
                <Button
                  className="sm:w-auto w-full"
                  disabled={addMutation.isPending}
                  variant={"outline"}
                  type="button"
                  onClick={() => {
                    setData(null);
                    setOpen(false);
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  className="md:mb-0 mb-2"
                  type="submit"
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Saqlash & Davom etish</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
