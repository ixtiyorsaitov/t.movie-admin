import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { IGenre } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { genreSchema } from "@/lib/validation";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  datas: IGenre[];
  open: boolean;
  initialData: IGenre | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDatas: Dispatch<SetStateAction<IGenre[]>>;
}

const GenreModal = ({ open, initialData, setDatas, setOpen }: Props) => {
  const form = useForm<z.infer<typeof genreSchema>>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: initialData ? initialData.name : "",
    },
  });
  useEffect(() => {
    if (initialData) {
      form.reset({ name: initialData.name });
    } else {
      form.reset({ name: "" });
    }
  }, [initialData]);

  const addMutation = useMutation({
    mutationFn: async (values: z.infer<typeof genreSchema>) => {
      const { data: response } = await axios.post("/api/genre", values);

      if (response.success) {
        setDatas((prev) => [...prev, response.data]);
        toast.success("Success!", { description: "Genre added successfuly!" });
      } else {
        toast.error("Error!", {
          description: response.error,
        });
      }

      return response;
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof genreSchema>) => {
      const { data: response } = await axios.post(
        `/api/genre/${initialData?._id}`
      );

      if (response.success) {
        setDatas((prev) =>
          prev.map((c) => {
            if (c._id === response.data._id) {
              return response.data;
            }
            c;
          })
        );
        toast.success("Success!", {
          description: "Genre updated successfuly!",
        });
      } else {
        toast.error("Error!", {
          description: response.error,
        });
      }

      return response;
    },
  });

  function onSubmit(values: z.infer<typeof genreSchema>) {
    if (initialData) {
      updateMutation.mutate(values);
    } else {
      addMutation.mutate(values);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {initialData === null ? "Add new" : "Update"} genre
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pleace enter the fields to{" "}
            {initialData === null ? "add new" : "update"} genre
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Name</Label>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Genre name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GenreModal;
