import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { IFilm, IGenre } from "@/types";
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
import { deleteSchema, genreSchema } from "@/lib/validation";
import { Label } from "../ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { useDeleteGenre } from "@/hooks/use-delete-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { badgeVariants } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

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
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        setDatas((prev) => [...prev, response.data]);
        toast.success("Genre added successfully!");
        form.reset();
      } else {
        toast.error(response.error || "Error adding genre");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof genreSchema>) => {
      const { data: response } = await axios.put(
        `/api/genre/${initialData?._id}`,
        values
      );
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        setDatas((prev) =>
          prev.map((c) => (c._id === response.data._id ? response.data : c))
        );
        toast.success("Genre updated successfully!");
        form.reset();
      } else {
        toast.error(response.error || "Error updating genre");
      }
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

export function GenreDeleteModal({
  setList,
}: {
  setList: Dispatch<SetStateAction<IGenre[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteGenre();

  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data: response } = await axios.delete(`/api/genre/${data?._id}`);
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        setList((prev) => prev.filter((c) => c._id !== data?._id));
        setData(null);
        toast.success("Genre deleted successfully!");
        form.reset();
      } else {
        toast.error(response.error || "Error deleting genre");
      }
    },
  });

  function onSubmit() {
    deleteMutation.mutate();
  }

  return data ? (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure you want to delete "{data.name}"?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the genre
            <span className="font-medium text-foreground">"{data.name}"</span>
            and disconnect it from its associated movies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert variant="destructive" className="mb-4">
          <Trash2 className="h-4 w-4" />
          <AlertTitle>Permanent Deletion Warning</AlertTitle>
          <AlertDescription>
            Deleting this genre is irreversible. All related content, comments,
            and analytics will be lost forever. Please proceed with caution.
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
                    <span className="font-bold text-red-500">{"'DELETE'"}</span>
                    deb yozing:
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={deleteMutation.isPending}
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
                disabled={deleteMutation.isPending}
                type="button"
                onClick={() => {
                  setData(null);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={deleteMutation.isPending}
                type="submit"
                className="!bg-red-900"
                variant={"destructive"}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}

export function GenreFilmsModal({
  genreId,
  open,
  setOpen,
}: {
  genreId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // const [datas, setDatas] = useState<IFilm[]>([]);
  const getDataQuery = useQuery({
    queryKey: ["genre-films", genreId],
    queryFn: async () => {
      const { data: response } = await axios.get(`/api/genre/${genreId}/films`);

      // setDatas(response.datas);
      return response;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Films about genre Action</DialogTitle>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline bg-secondary px-2">
                  {getDataQuery.isPending ? (
                    <Skeleton className="w-1/3 h-3 dark:bg-white bg-black" />
                  ) : (
                    <>
                      {getDataQuery.data.datas.length}{" "}
                      {getDataQuery.data.datas.length > 1 ? "films" : "film"}
                    </>
                  )}
                </AccordionTrigger>
                <AccordionContent className="dark:text-white text-black h-full max-h-[500px] overflow-auto mt-2">
                  {getDataQuery.isPending
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-full flex items-center justify-between bg-secondary mt-2 p-2 rounded-md"
                        >
                          <Skeleton className="h-4 w-1/2 dark:bg-white bg-black" />
                          <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                      ))
                    : getDataQuery.data.datas.map((item: IFilm) => (
                        <div
                          key={item._id}
                          className="w-full flex items-center justify-between bg-secondary mt-2 p-2 rounded-md"
                        >
                          <p className="max-w-[300px] line-clamp-1">
                            {item.title}
                          </p>
                          <Link
                            className={cn(badgeVariants())}
                            href={`/dashboard/films/${item._id}`}
                          >
                            Get
                          </Link>
                        </div>
                      ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
