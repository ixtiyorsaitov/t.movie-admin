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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";
import { removeVideo } from "@/lib/supabase-utils";
import { BUCKETS, IEpisode } from "@/types";
import { deleteSchema, episodeSchmea } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useAddEpisode } from "@/hooks/useEpisode";

export function DeleteEpisodeModal({
  setEpisodes,
}: {
  setEpisodes: Dispatch<SetStateAction<IEpisode[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteEpisode();
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  // Reset form when the modal opens/closes
  useEffect(() => {
    if (!open) {
      setData(null);
      form.reset(); // Reset form fields and errors
    }
  }, [open, setData, form]);

  const onSubmit = async () => {
    // try {
    //   setLoading(true);
    //   const deletedVideo = await removeVideo(
    //     [data?.video.name as string],
    //     BUCKETS.SERIES
    //   );
    //   if (!deletedVideo.success) {
    //     toast.error("ERROR", {
    //       description: "Error with deleting video",
    //     });
    //   }
    //   const { data: response } = await axios.delete(
    //     `/api/film/filmId/control/episode/${data?._id}`
    //   );
    //   console.log(response);
    //   if (response.success) {
    //     setData(null);
    //     setOpen(false);
    //     toast.success("Success", {
    //       description: "Season deleted successfuly!",
    //     });
    //     setEpisodes((prev) => prev.filter((c) => c._id !== response.data._id));
    //   }
    // } catch (error) {
    //   toast.error("ERROR", {
    //     description: "Something went wrong with deleting episode",
    //   });
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    open &&
    data != null && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure you want to delete "{data.title}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              episode{" "}
              <span className="font-medium text-foreground">
                "{data.title}"
              </span>{" "}
              and remove its associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Alert variant="destructive" className="mb-4">
            <Trash2 className="h-4 w-4" />
            <AlertTitle>Permanent Deletion Warning</AlertTitle>
            <AlertDescription>
              Deleting this episode is irreversible. All related content,
              comments, and analytics will be lost forever. Please proceed with
              caution.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="confirmText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tasdiqlash uchun, pastga{" "}
                      <span className="font-bold text-red-500">
                        {"'DELETE'"}
                      </span>
                      deb yozing:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={loading}
                        placeholder="Type delete"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-end gap-1">
                <Button
                  variant={"secondary"}
                  disabled={loading}
                  type="button"
                  onClick={() => {
                    setData(null);
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  type="submit"
                  className="!bg-red-900"
                  variant={"destructive"}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Trash />}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}

export const EpisodeModal = ({ filmId }: { filmId: string }) => {
  const { open, setOpen, data } = useEpisodeModal();
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof episodeSchmea>>({
    resolver: zodResolver(episodeSchmea),
    defaultValues: {
      title: data ? data.title : "",
      description: data ? data.description : "",
      episodeNumber: data ? String(data.episodeNumber) : "",
    },
  });
  const addMutation = useAddEpisode({ filmId, videoFile });
  function onSubmit(values: z.infer<typeof episodeSchmea>) {
    if (data) {
      // updateEpisodeMutation.mutate(values);
    } else {
      if (!videoFile) {
        return toast.error("Xatolik", {
          description: "Iltimos qurilmangizdan videoni tanlang",
        });
      }
      addMutation.mutate(values, {
        onSuccess: (res) => {
          if (res.success) {
            // setDatas((prev) => [...prev, response.data]);
            toast.success("Epizod muvafaqqiyatli qo'shildi!");
            form.reset();
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
                          <Input disabled={false} type="number" {...field} />
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
                            disabled={false}
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
                          disabled={false}
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
                  {true && (
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
                  disabled={false}
                  variant={"outline"}
                >
                  Bekor qilish
                </Button>
                <Button className="md:mb-0 mb-2" type="submit" disabled={false}>
                  {false ? (
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
