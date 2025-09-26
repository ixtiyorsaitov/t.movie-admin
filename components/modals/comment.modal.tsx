import { useCommentModal, useDeleteComment } from "@/hooks/use-modals";
import {
  useCreateComment,
  useDeleteCommentMutation,
  useUpdateComment,
} from "@/hooks/useComments";
import { commentSchema } from "@/lib/validation";
import { IReview } from "@/types/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendIcon, Trash2 } from "lucide-react";
import { IComment } from "@/types/comment";
import { Textarea } from "../ui/textarea";

const CommentModal = ({
  setDatas,
}: {
  setDatas: Dispatch<SetStateAction<IComment[]>>;
}) => {
  const commentModal = useCommentModal();
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: commentModal.data ? commentModal.data.content : "",
    },
  });
  useEffect(() => {
    if (commentModal.data) {
      form.reset({
        content: commentModal.data.content,
      });
    } else {
      form.reset({ content: "" });
    }
  }, [commentModal.data]);

  const createMutation = useCreateComment();
  const updateMutation = useUpdateComment();

  function onSubmit(values: z.infer<typeof commentSchema>) {
    console.log(values);

    if (commentModal.data) {
      updateMutation.mutate(
        { values, commentId: commentModal.data._id },
        {
          onSuccess: (response) => {
            console.log(response);

            if (response.success) {
              commentModal.setOpen(false);
              commentModal.setData(null);
              setDatas((prev) =>
                prev.map((c) =>
                  c._id === response.data._id ? response.data : c
                )
              );
              toast.success("Izoh muvaffaqiyatli yangilandi!");
              form.reset();
            } else {
              toast.error(response.error || "Izohni yangilashda xatolik");
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        { values, filmId: "68b14323731a95d2b6675986" },
        {
          onSuccess: (response) => {
            console.log(response);

            if (response.success) {
              setDatas((prev) => [response.data, ...prev]);
              toast.success("Izoh muvaffaqiyatli qo'shildi!");
              commentModal.setOpen(false);
              form.reset();
            } else {
              toast.error(response.error || "Izoh qo'shishda xatolik");
            }
          },
        }
      );
    }
  }

  return (
    <AlertDialog open={commentModal.open} onOpenChange={commentModal.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {commentModal.data === null ? "Izoh yozish" : "Izohni yangilash"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Iltimos, {commentModal.data ? "izohni yangilash" : "izoh qo'shish"}{" "}
            uchun kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fikr</FormLabel>
                  <FormControl>
                    <Textarea
                      className="max-h-[200px] scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      autoComplete="off"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={createMutation.isPending || updateMutation.isPending}
                type="button"
                onClick={() => {
                  commentModal.setData(null);
                  commentModal.setOpen(false);
                }}
              >
                Bekor qilish
              </AlertDialogCancel>
              <Button
                disabled={createMutation.isPending || updateMutation.isPending}
                type="submit"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                {commentModal.data ? "Yangilash" : "Yaratish"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommentModal;

export function CommentDeleteModal({
  setList,
}: {
  setList: Dispatch<SetStateAction<IComment[]>>;
}) {
  const { open, setOpen, data, setData } = useDeleteComment();
  const deleteComment = useDeleteCommentMutation();
  function handleDelete() {
    if (!data) return;
    deleteComment.mutate(data._id, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Izoh muvaffaqiyatli o'chirildi!");
          
          setList((prev) =>
            prev.filter((c) => c._id !== data._id && c.parent !== data._id)
          );
          setOpen(false);
          setData(null);
        } else {
          toast.error(response.error || "Izohni o'chirishda xatolik");
        }
      },
    });
  }
  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Izohni o'chirib tashlash"}</AlertDialogTitle>
            <AlertDialogDescription>
              Siz haqiqatdan ham
              <span className="font-bold text-white">{` ${data.content} `}</span>
              izohini {"o'chirib"} tashlamoqchimisiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteComment.isPending}
              onClick={() => {
                setData(null);
                setOpen(false);
              }}
            >
              Bekor qilish
            </AlertDialogCancel>
            <Button
              disabled={deleteComment.isPending}
              variant={"destructive"}
              onClick={handleDelete}
            >
              {deleteComment.isPending ? (
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
