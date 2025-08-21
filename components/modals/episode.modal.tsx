"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trash, Trash2 } from "lucide-react";

import { useDeleteEpisode } from "@/hooks/use-modals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { deleteSchema } from "@/lib/validation";

export function EpisodeDeleteModal({
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
    try {
      setLoading(true);
      const deletedVideo = await removeVideo(
        [data?.video.name as string],
        BUCKETS.SERIES
      );
      if (!deletedVideo.success) {
        toast.error("ERROR", {
          description: "Error with deleting video",
        });
      }
      const { data: response } = await axios.delete(
        `/api/film/filmId/control/episode/${data?._id}`
      );
      console.log(response);
      if (response.success) {
        setData(null);
        setOpen(false);
        toast.success("Success", {
          description: "Season deleted successfuly!",
        });
        setEpisodes((prev) => prev.filter((c) => c._id !== response.data._id));
      }
    } catch (error) {
      toast.error("ERROR", {
        description: "Something went wrong with deleting episode",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
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

// This component is not modified, keeping it as is from your original input
export default function EpisodeModal() {
  return <div>EpisodeModal</div>;
}
