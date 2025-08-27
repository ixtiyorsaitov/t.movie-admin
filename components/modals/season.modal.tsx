import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { seasonSchema } from "@/lib/validation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2, Plus, SaveIcon, Settings } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { IFilm, ISeason } from "@/types";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const SeasonModal = ({
  data,
  setData,
  initialSeason,
}: {
  initialSeason: ISeason | null;
  data: IFilm;
  setData: Dispatch<SetStateAction<IFilm>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof seasonSchema>>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      title: initialSeason ? initialSeason.title : "",
      number: initialSeason
        ? `${initialSeason.seasonNumber}`
        : `${data?.seasons?.length + 1 || 1}`,
    },
  });

  useEffect(() => {
    if (initialSeason) {
      form.setValue("title", initialSeason.title);
      form.setValue("number", `${initialSeason.seasonNumber}`);
    } else {
      form.setValue("title", "");
      form.setValue("number", `${data?.seasons?.length + 1 || 1}`);
    }
  }, [initialSeason]);

  const addMutation = useMutation({
    mutationFn: async (values: z.infer<typeof seasonSchema>) => {
      setLoading(true);
      const { data: response } = await axios.post(
        `/api/films/${data._id}/control/season`,
        { ...values, number: Number(values.number) }
      );
      if (response.success) {
        toast.success("Season added successfuly!");
        form.reset();
        setData((prev) => {
          return { ...prev, seasons: [...prev.seasons, response.data] };
        });
        setOpen(false);
      } else {
        toast.error(response.error);
      }
      return response;
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof seasonSchema>) => {
      setLoading(true);
      const { data: response } = await axios.put(
        `/api/films/${data._id}/control/season/${initialSeason?._id}`,
        { ...values, number: Number(values.number) }
      );
      if (response.success) {
        toast.success("Season updated successfuly!");
        setData((prev) => {
          return {
            ...prev,
            seasons: prev.seasons.map((c) =>
              c._id === response.data._id
                ? {
                    ...c,
                    title: response.data.title,
                    seasonNumber: response.data.seasonNumber,
                  }
                : c
            ),
          };
        });
        setOpen(false);
      } else {
        toast.error(response.error);
      }
      return response;
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const onSubmit = (values: z.infer<typeof seasonSchema>) => {
    if (initialSeason) {
      updateMutation.mutate(values);
    } else {
      addMutation.mutate(values);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {!initialSeason ? (
          <Button disabled={loading}>
            <Plus className="w-4 h-4" />
            <span className="sm:flex hidden">Add Season</span>
          </Button>
        ) : (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="size-7 dark:hover:bg-white/10 hover:bg-black/10"
          >
            <Settings />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialSeason === null ? "Add new" : "Update"} season
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pleace enter the fields to{" "}
            {initialSeason === null ? "add new" : "update"} season
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full gap-1 flex items-center justify-end">
              <Button
                onClick={() => {
                  setOpen(false);
                }}
                disabled={loading}
                type="button"
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>{initialSeason ? <SaveIcon /> : <Plus />}</>
                )}
                {initialSeason ? "Save season" : "Add season"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SeasonModal;
