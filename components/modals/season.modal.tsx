import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { seasonSchema } from "@/lib/validation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { IFilm } from "@/types";
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

const SeasonModal = ({
  data,
  setData,
}: {
  data: IFilm;
  setData: Dispatch<SetStateAction<IFilm>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof seasonSchema>>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      title: "",
      number: `${data?.seasons?.length + 1 || 1}`,
    },
  });

  const addMutation = useMutation({
    mutationFn: async (values: z.infer<typeof seasonSchema>) => {
      setLoading(true);
      const { data: response } = await axios.post(
        `/api/film/${data._id}/control/season`,
        { ...values, number: Number(values.number) }
      );
      console.log(response);
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
  const onSubmit = (values: z.infer<typeof seasonSchema>) => {
    console.log(values);
    addMutation.mutate(values);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={loading}>
          <Plus className="w-4 h-4" />
          <span>Add Season</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new season</DialogTitle>
          <DialogDescription>
            Pleace enter the fields to add new season
          </DialogDescription>
        </DialogHeader>
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
                  <FormLabel>Episode number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Submit
              {loading && <Loader2 className="animate-spin" />}{" "}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SeasonModal;
