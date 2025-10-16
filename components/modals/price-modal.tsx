"use client";

import { IPrice } from "@/types/price";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useDeletePriceModal } from "@/hooks/use-modals";
import { useForm } from "react-hook-form";
import z from "zod";
import { deleteSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDeletePriceMutation } from "@/hooks/usePrices";

interface Props {
  setDatas: Dispatch<SetStateAction<IPrice[]>>;
}

export function DeletePriceModal({ setDatas }: Props) {
  const { open, setOpen, data, setData } = useDeletePriceModal();
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

  const deleteMutation = useDeletePriceMutation();

  function onSubmit() {
    if (data) {
      deleteMutation.mutate(data?._id, {
        onSuccess: (response) => {
          if (response.success) {
            setDatas((prev) => prev.filter((c) => c._id !== data?._id));
            setData(null);
            toast.success("Ta'rif o'chirildi");
            setOpen(false);
            form.reset();
          } else {
            toast.error(
              response.error || "Ta'rifni o'chirishda xatolik yuz berdi"
            );
          }
        },
      });
    }
  }

  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="text-muted-foreground">
                Haqiqatdan ham{" "}
                <span className="text-foreground">{data.name}</span>{" "}
                {"ta'rifini o'chirmoqchimisiz?"}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
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
                      <span className="font-bold text-red-500">
                        {"'DELETE'"}
                      </span>
                      deb yozing:
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        disabled={deleteMutation.isPending}
                        placeholder="DELETE"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-end gap-1">
                <Button
                  variant={"outline"}
                  disabled={deleteMutation.isPending}
                  type="button"
                  onClick={() => {
                    setData(null);
                    setOpen(false);
                  }}
                >
                  Bekor qilish
                </Button>
                <Button
                  disabled={deleteMutation.isPending}
                  type="submit"
                  variant={"destructive"}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 />
                  )}
                  {"O'chirish"}
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}
