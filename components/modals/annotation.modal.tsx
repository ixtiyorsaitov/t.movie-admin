import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { annotationSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAnnotationModal, useDeleteAnnotation } from "@/hooks/use-modals";
import {
  useCreateAnnotation,
  useDeleteAnnotationMutation,
  useUpdateAnnotation,
} from "@/hooks/useAnnotations";
import { IAnnotation } from "@/types/annotation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

export function AnnotationModal({
  setDatas,
}: {
  setDatas: Dispatch<SetStateAction<IAnnotation[]>>;
}) {
  const annotationModal = useAnnotationModal();
  const form = useForm<z.infer<typeof annotationSchema>>({
    resolver: zodResolver(annotationSchema),
    defaultValues: {
      subtitle: annotationModal.data ? annotationModal.data.subtitle : "",
      title: annotationModal.data ? annotationModal.data.title : "",
      description: annotationModal.data ? annotationModal.data.description : "",
      ytUrl: annotationModal.data ? annotationModal.data.ytUrl : "",
    },
  });
  useEffect(() => {
    if (annotationModal.data) {
      form.reset({
        subtitle: annotationModal.data.subtitle,
        title: annotationModal.data.title,
        description: annotationModal.data.description,
        ytUrl: annotationModal.data.ytUrl,
      });
    } else {
      form.reset({
        subtitle: "",
        title: "",
        description: "",
        ytUrl: "",
      });
    }
  }, [annotationModal.data]);
  const createMutation = useCreateAnnotation();
  const updateMutation = useUpdateAnnotation();
  function onSubmit(values: z.infer<typeof annotationSchema>) {
    console.log(values);

    if (annotationModal.data) {
      updateMutation.mutate(
        { values, annotationId: annotationModal.data._id },
        {
          onSuccess: (res) => {
            if (res.success) {
              setDatas((prev) =>
                prev.map((c) => (c._id === res.data._id ? res.data : c))
              );
              toast.success("Anotatsiya yangilandi");
              annotationModal.setData(null);
              annotationModal.setOpen(false);
              form.reset();
            } else {
              toast.error(res.error || "Anotatsiyani yangilashda xatolik");
            }
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: (res) => {
          if (res.success) {
            setDatas((prev) => [...prev, res.data]);
            toast.success("Anotatsiya qo'shildi");
            annotationModal.setData(null);
            annotationModal.setOpen(false);
            form.reset();
          } else {
            toast.error(res.error || "Anotatsiya qo'shishda xatolik");
          }
        },
      });
    }
  }
  return (
    <AlertDialog
      open={annotationModal.open}
      onOpenChange={annotationModal.setOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {annotationModal.data === null
              ? "Annotatsiya qo'shish"
              : "Annotatsiyani yangilash"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Iltimos,{" "}
            {annotationModal.data
              ? "annotatsiyani yangilash"
              : "annotatsiya qo'shish"}{" "}
            uchun kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <Label>Subtitr</Label>
                  <FormControl>
                    <Input
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      autoComplete="off"
                      placeholder="Hamma animelar..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>Sarvlaha</Label>
                  <FormControl>
                    <Input
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label>Tavsif</Label>
                  <FormControl>
                    <Textarea
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ytUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>Youtube linki</Label>
                  <FormControl>
                    <Input
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      placeholder="https://www.youtube.com/watch?..."
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <Button
                variant={"secondary"}
                onClick={() => {
                  annotationModal.setData(null);
                  annotationModal.setOpen(false);
                }}
                disabled={createMutation.isPending || updateMutation.isPending}
                type="button"
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {annotationModal.data ? "Yangilash" : "Qo'shish"}
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="animate-spin" />
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AnnotationDeleteModal({
  setDatas,
}: {
  setDatas: Dispatch<SetStateAction<IAnnotation[]>>;
}) {
  const { open, setOpen, data, setData } = useDeleteAnnotation();
  const deleteMutation = useDeleteAnnotationMutation();
  const handleDelete = () => {
    if (!data) return;
    deleteMutation.mutate(data?._id, {
      onSuccess: (response) => {
        if (response.success) {
          setDatas((prev) => prev.filter((c) => c._id !== data?._id));
          setData(null);
          toast.success("Annontation o'chirildi");
          setOpen(false);
        } else {
          toast.error(response.error || "Annontation o'chirishda xatolik");
        }
      },
    });
  };
  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Anotatsiyani o'chirishs"}</AlertDialogTitle>
            <AlertDialogDescription>
              Siz haqiqatdan ham
              <span className="font-bold text-white line-clamp-1">{` ${data.title} `}</span>
              anotatsiyasini {"o'chirib"} tashlamoqchimisiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              onClick={() => {
                setData(null);
                setOpen(false);
              }}
            >
              Bekor qilish
            </AlertDialogCancel>
            <Button
              disabled={deleteMutation.isPending}
              variant={"destructive"}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              {"O'chirish"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}
