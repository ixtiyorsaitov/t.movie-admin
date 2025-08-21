import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AlertDialog,
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
import { Eye, Film, Loader2, Trash2 } from "lucide-react";
import {
  useDeleteGenre,
  useGenreFilmsModal,
  useGenreModal,
} from "@/hooks/use-modals";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

interface Props {
  setDatas: Dispatch<SetStateAction<IGenre[]>>;
}

const GenreModal = ({ setDatas }: Props) => {
  const genreModal = useGenreModal();
  const form = useForm<z.infer<typeof genreSchema>>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: genreModal.data ? genreModal.data.name : "",
    },
  });
  useEffect(() => {
    if (genreModal.data) {
      form.reset({ name: genreModal.data.name });
    } else {
      form.reset({ name: "" });
    }
  }, [genreModal.data]);

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
        `/api/genre/${genreModal.data?._id}`,
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
        genreModal.setOpen(false);

        form.reset();
      } else {
        toast.error(response.error || "Error updating genre");
      }
    },
  });

  function onSubmit(values: z.infer<typeof genreSchema>) {
    if (genreModal.data) {
      updateMutation.mutate(values);
    } else {
      addMutation.mutate(values);
    }
  }

  return (
    <AlertDialog open={genreModal.open} onOpenChange={genreModal.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {genreModal.data === null ? "Janr qo'shish" : "Janrni yangilash"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Iltimos, {genreModal.data ? "janrni yangilash" : "janr qo'shish"}{" "}
            uchun kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Nomi</Label>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Janr nomi..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Bekor qilish</AlertDialogCancel>
              <Button type="submit">Davom etish</Button>
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
        toast.success("Janr o'chirildi");
        setOpen(false);
        form.reset();
      } else {
        toast.error(response.error || "Janrni o'chirishda xatolik yuz berdi");
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
            {`Siz "${data.name}" janrini o'chirmoqchiligingizga aminmisiz?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bu buyruqni orqaga qaytarib {"bo'lmaydi"}. Janr {"o'chgandan"} keyin
            shu janrga aloqador barcha filmlardan
            <span className="font-medium text-foreground">{` "${data.name}" `}</span>
            janri olib tashlanadi
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

export function GenreFilmsModal() {
  const modal = useGenreFilmsModal();
  const getDataQuery = useQuery({
    queryKey: ["genre-films", modal.data?._id],
    queryFn: async () => {
      const { data: response } = await axios.get(
        `/api/genre/${modal.data?._id}/films`
      );
      return response;
    },
  });

  return (
    <Dialog open={modal.open} onOpenChange={modal.setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Film className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                {modal.data?.name || "Janr"} {"bo'yicha filmlar"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ushbu janrga tegishli barcha filmlar {"ro'yxati"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="hover:no-underline bg-muted/50 hover:bg-muted px-4 py-3 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  {getDataQuery.isPending ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <>
                      <Badge variant="secondary" className="font-medium">
                        {getDataQuery.data?.datas?.length || 0}
                      </Badge>
                      <span className="text-sm font-medium">
                        {(getDataQuery.data?.datas?.length || 0) === 1
                          ? "film"
                          : "filmlar"}
                      </span>
                    </>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                  {getDataQuery.isPending ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-16 rounded-md" />
                      </div>
                    ))
                  ) : getDataQuery.data?.datas?.length > 0 ? (
                    getDataQuery.data.datas.map(
                      (item: IFilm, index: number) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Film className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Film #{index + 1}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/dashboard/films/${item._id}`}
                            className="ml-3"
                          >
                            <Badge
                              variant="outline"
                              className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              {"Ko'rish"}
                            </Badge>
                          </Link>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto">
                        <Film className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Filmlar topilmadi
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                          Ushbu janrga tegishli filmlar hali {"qo'shilmagan"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
