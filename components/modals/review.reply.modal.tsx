"use client";

import {
  useDeleteRepliedReview,
  useReviewReplyModal,
} from "@/hooks/use-modals";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { replyReviewSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Loader2, Shield, Trash2, User } from "lucide-react";
import {
  useDeleteReplyReviewMutation,
  useReplyReviewMutation,
} from "@/hooks/useReviews";
import { toast } from "sonner";
import { IReview } from "@/types/review";

const ReviewReplyModal = ({
  setList,
}: {
  setList: Dispatch<SetStateAction<IReview[]>>;
}) => {
  const { open, setOpen, data, setData } = useReviewReplyModal();

  const form = useForm<z.infer<typeof replyReviewSchema>>({
    resolver: zodResolver(replyReviewSchema),
    defaultValues: {
      text: "",
      asAdmin: false,
    },
  });

  useEffect(() => {
    if (data?.reply) {
      form.reset({
        text: data.reply.text,
        asAdmin: data.reply.asAdmin,
      });
    } else {
      form.reset({ text: "", asAdmin: false });
    }
  }, [data, form]);

  const replyReviewMutation = useReplyReviewMutation();

  function onSubmit(values: z.infer<typeof replyReviewSchema>) {
    replyReviewMutation.mutate(
      { ...values, reviewId: data?._id as string },
      {
        onSuccess: (response) => {
          console.log(response);
          if (response.success) {
            toast.success(data?.reply ? "Javob tahrirlandi" : "Javob yozildi");
            setList((prev) =>
              prev.map((item) =>
                item._id === response.data._id ? response.data : item
              )
            );
            setData(null);
            setOpen(false);
          } else {
            toast.error(response.error || "Javobni yozishda xatolik");
          }
        },
      }
    );
  }

  const watchAsAdmin = form.watch("asAdmin");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Sharhga javob qaytarish</AlertDialogTitle>
          <AlertDialogDescription>
            Sharhga javob yozish uchun kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <Label>Javob matni</Label>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Javobingizni yozing..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="asAdmin"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {watchAsAdmin ? (
                          <Shield className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label className="text-sm font-medium">
                          Admin sifatida javob berish
                        </Label>
                        <FormDescription className="text-xs text-muted-foreground mt-1">
                          {watchAsAdmin ? (
                            <span className="text-primary font-medium">
                              Javobingiz admin sifatida {"ko'rinadi"}
                            </span>
                          ) : (
                            <span>
                              Javobingiz oddiy foydalanuvchi sifatida{" "}
                              {"ko'rinadi"}
                            </span>
                          )}
                        </FormDescription>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="ml-3"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel type="button">Bekor qilish</AlertDialogCancel>
              <Button type="submit" className="min-w-[100px]">
                Davom etish
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewReplyModal;

export function ReviewDeleteReplyModal({
  setList,
}: {
  setList: Dispatch<SetStateAction<IReview[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteRepliedReview();

  const deleteMutation = useDeleteReplyReviewMutation();

  function onSubmit() {
    if (data) {
      deleteMutation.mutate(data?._id, {
        onSuccess: (response) => {
          console.log(response);

          if (response.success) {
            toast.success("Javob o'chirildi");
            setData(null);
            setOpen(false);
            setList((prev) =>
              prev.map((item) =>
                item._id === response.data._id ? response.data : item
              )
            );
          } else {
            toast.error(
              response.error || "Javobni o'chirishda xatolik yuz berdi"
            );
          }
        },
      });
    }
  }

  return data ? (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`"${data.text}" sharhidan javobni o'chirmoqchimisiz?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bu buyruqni orqaga qaytarib {"bo'lmaydi"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="w-full flex items-center justify-end gap-1">
          <Button
            variant={"secondary"}
            disabled={deleteMutation.isPending}
            onClick={() => {
              setData(null);
              setOpen(false);
            }}
          >
            Bekor qilish
          </Button>
          <Button
            disabled={deleteMutation.isPending}
            className="!bg-red-900"
            variant={"destructive"}
            onClick={onSubmit}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
            {"O'chirish"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
}
