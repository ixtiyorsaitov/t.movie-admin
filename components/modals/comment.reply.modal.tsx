"use client";

import {
  useCommentReplyModal,
  useDeleteRepliedComment,
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
import { replyCommentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import {
  Check,
  CheckCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useDeleteReplyReviewMutation } from "@/hooks/useReviews";
import { toast } from "sonner";
import { IReview } from "@/types/review";
import {
  useDeleteReplyCommentMutation,
  useReplyCommentMutation,
  useUpdateReplyCommentMutation,
} from "@/hooks/useComments";
import { IComment } from "@/types/comment";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ROLE } from "@/types";
import { checkRoleIsOriginal, translateRole } from "@/lib/utils";
import CheckMarkIcon from "@/public/icons/checkmark";

const CommentReplyModal = ({
  list,
  setList,
}: {
  list: IComment[];
  setList: Dispatch<SetStateAction<IComment[]>>;
}) => {
  const { open, setOpen, data, setData } = useCommentReplyModal();

  const form = useForm<z.infer<typeof replyCommentSchema>>({
    resolver: zodResolver(replyCommentSchema),
    defaultValues: {
      content: "",
      asAdmin: false,
    },
  });

  useEffect(() => {
    if (data?.reply) {
      form.reset({
        content: data.reply.comment.content,
        asAdmin: data.reply.asAdmin,
      });
    } else {
      form.reset({ content: "", asAdmin: false });
    }
  }, [data, form]);

  const replyCommentMutation = useReplyCommentMutation();
  const updateReplyCommentMutation = useUpdateReplyCommentMutation();

  function onSubmit(values: z.infer<typeof replyCommentSchema>) {
    if (!data) return;
    if (data.reply) {
      updateReplyCommentMutation.mutate(
        { ...values, commentId: data._id },
        {
          onSuccess: (response) => {
            console.log(response);
            if (response.success) {
              toast.success("Javob tahrirlandi");
              const updatedParentList = list.map((item) =>
                item._id === response.data._id ? response.data : item
              ) as IComment[];
              setList(
                updatedParentList.map((item) =>
                  item._id === response.replied._id ? response.replied : item
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
    } else {
      replyCommentMutation.mutate(
        { ...values, commentId: data._id, filmId: data.film._id },
        {
          onSuccess: (response) => {
            console.log(response);
            if (response.success) {
              toast.success(
                data?.reply ? "Javob tahrirlandi" : "Javob yozildi"
              );
              setList((prev) => [
                response.replied,
                ...prev.map((item) =>
                  item._id === response.data._id ? response.data : item
                ),
              ]);
              setData(null);
              setOpen(false);
            } else {
              toast.error(response.error || "Javobni yozishda xatolik");
            }
          },
        }
      );
    }
  }

  const watchAsAdmin = form.watch("asAdmin");

  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Izohga javob qaytarish</AlertDialogTitle>
            <AlertDialogDescription>
              Izohga javob yozish uchun kerakli maydonlarni {"to'ldiring"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="w-full flex items-center justify-start gap-2">
            <Avatar>
              <AvatarImage src={data.user.avatar || ""} />
              <AvatarFallback>
                {data?.user.name.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium leading-none flex items-center justify-start">
                {data.user.name}
                {checkRoleIsOriginal(data.user.role) && (
                  <span className="ml-1">
                    <CheckMarkIcon className="text-primary fill-primary" />
                  </span>
                )}
              </p>

              <p className="text-xs text-muted-foreground">
                {translateRole(data.user.role)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Izoh matni</Label>
            <Textarea
              value={data?.content}
              disabled
              className="max-h-[200px]"
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <Label>Javob matni</Label>
                    <FormControl>
                      <Input
                        disabled={replyCommentMutation.isPending}
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
                          disabled={replyCommentMutation.isPending}
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
                <AlertDialogCancel
                  type="button"
                  onClick={() => {
                    setData(null);
                    setOpen(false);
                  }}
                  disabled={replyCommentMutation.isPending}
                >
                  Bekor qilish
                </AlertDialogCancel>
                <Button
                  type="submit"
                  className="min-w-[100px]"
                  disabled={replyCommentMutation.isPending}
                >
                  {replyCommentMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {data?.reply ? "Tahrirlash" : "Javob berish"}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default CommentReplyModal;

export function CommentDeleteReplyModal({
  list,
  setList,
}: {
  list: IComment[];
  setList: Dispatch<SetStateAction<IComment[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteRepliedComment();

  const deleteMutation = useDeleteReplyCommentMutation();

  function onSubmit() {
    if (data) {
      deleteMutation.mutate(data?._id, {
        onSuccess: (response) => {
          console.log(response);

          if (response.success) {
            toast.success("Javob o'chirildi");
            setData(null);
            setOpen(false);
            const filteredList = list.filter(
              (item) => item._id !== response.deleted._id
            );
            setList(
              filteredList.map((item) =>
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
            {`"${data.content}" izohidan javobni o'chirmoqchimisiz?`}
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
