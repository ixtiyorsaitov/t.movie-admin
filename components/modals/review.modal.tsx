import { useDeleteReview, useReviewModal } from "@/hooks/use-modals";
import { reviewSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { IReview } from "@/types/review";
import { useCreateReview } from "@/hooks/useReviews";
import { Rating } from "../ui/rating";
import { Loader2, Trash2 } from "lucide-react";

const ReviewModal = ({
  setDatas,
}: {
  setDatas: Dispatch<SetStateAction<IReview[]>>;
}) => {
  const reviewModal = useReviewModal();
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      text: reviewModal.data ? reviewModal.data.text : "",
      rating: reviewModal.data ? reviewModal.data.rating : 5,
    },
  });
  useEffect(() => {
    if (reviewModal.data) {
      form.reset({
        text: reviewModal.data.text,
        rating: reviewModal.data.rating,
      });
    } else {
      form.reset({ text: "", rating: 5 });
    }
  }, [reviewModal.data]);

  const createMutation = useCreateReview();
  //   const updateMutation = useUpdateGenre();

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    console.log(values);

    if (reviewModal.data) {
      //   updateMutation.mutate(
      //     { values, genreId: reviewModal.data._id },
      //     {
      //       onSuccess: (response) => {
      //         if (response.success) {
      //           setDatas((prev) =>
      //             prev.map((c) =>
      //               c._id === response.data._id ? response.data : c
      //             )
      //           );
      //           toast.success("Sharh muvaffaqiyatli yangilandi!");
      //           reviewModal.setOpen(false);
      //           form.reset();
      //         } else {
      //           toast.error(response.error || "Sharhni yangilashda xatolik");
      //         }
      //       },
      //     }
      //   );
    } else {
      createMutation.mutate(
        { values, filmId: "68b14323731a95d2b6675986" },
        {
          onSuccess: (response) => {
            console.log(response);

            if (response.success) {
              setDatas((prev) => [...prev, response.data]);
              toast.success("Sharh muvaffaqiyatli qo'shildi!");
              form.reset();
            } else {
              toast.error(response.error || "Sharh qo'shishda xatolik");
            }
          },
        }
      );
    }
  }

  return (
    <AlertDialog open={reviewModal.open} onOpenChange={reviewModal.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {reviewModal.data === null ? "Shar yozish" : "Sharhni yangilash"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Iltimos,{" "}
            {reviewModal.data ? "sharhni yanglilash" : "sharh qo'shish"} uchun
            kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <Label>Fikr (Ixtiyoriy)</Label>
                  <FormControl>
                    <Input autoComplete="off" placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <Label>Reyting</Label>
                  <FormControl className="w-full">
                    <Rating {...field} />
                  </FormControl>
                  <FormDescription>
                    Iltimos filmning sizga qanchalik yoqganligini belgilang.
                  </FormDescription>
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

export default ReviewModal;

export function ReviewDeleteModal({
  setList,
}: {
  setList: Dispatch<SetStateAction<IReview[]>>;
}) {
  const { open, data, setOpen, setData } = useDeleteReview();
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  const deleteMutation = useDeleteReviewMutation();

  function onSubmit() {
    if (data) {
      deleteMutation.mutate(data?._id, {
        onSuccess: (response) => {
          if (response.success) {
            setList((prev) => prev.filter((c) => c._id !== data?._id));
            setData(null);
            toast.success("Sharh o'chirildi");
            setOpen(false);
          } else {
            toast.error(
              response.error || "Sharhni o'chirishda xatolik yuz berdi"
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
            {`Siz "${data.film.title}" filmidan ${data.text} sharhni o'chirmoqchiligingizga aminmisiz?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bu buyruqni orqaga qaytarib {"bo'lmaydi"}. Sharh {"o'chgandan"}{" "}
            keyin shu sharh {"o'chirish"}
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
