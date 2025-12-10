"use client";

import { useMemberModal } from "@/hooks/use-modals";
import { memberSchema } from "@/lib/validation";
import { IMember } from "@/types/member";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  AlertDialog,
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCreateMember, useUpdateMember } from "@/hooks/useMembers";
import { Checkbox } from "../ui/checkbox";
import { MemberType } from "@/types";
import { Card } from "../ui/card";
import { defineMemberType, defineMemberTypeIcon } from "@/lib/utils";

interface Props {
  setDatas: Dispatch<SetStateAction<IMember[]>>;
}

const MemberModal = ({ setDatas }: Props) => {
  const modal = useMemberModal();
  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      userId: "",
      type: [],
    },
  });

  useEffect(() => {
    if (modal.data) {
      form.setValue("userId", modal.data.user._id);
      form.setValue("type", modal.data.type);
    } else {
      form.reset({
        userId: "",
        type: [],
      });
    }
  }, [modal.data, form]);

  const createMutation = useCreateMember();
  const updateMutation = useUpdateMember();

  function onSubmit(values: z.infer<typeof memberSchema>) {
    if (modal.data) {
      updateMutation.mutate(
        {
          userId: values.userId,
          type: values.type,
          memberId: modal.data._id,
        },
        {
          onSuccess: (response) => {
            if (response.success) {
              setDatas((prev) =>
                prev.map((c) =>
                  c._id === response.data._id ? response.data : c
                )
              );
              toast.success("Hodim muvaffaqiyatli yangilandi!");
              modal.setOpen(false);

              form.reset();
            } else {
              toast.error(response.error || "Hodimni yangilashda xatolik");
            }
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: (response) => {
          if (response.success) {
            setDatas((prev) => [...prev, response.data]);
            toast.success("Hodim muvaffaqiyatli qo'shildi!");
            form.reset();
          } else {
            toast.error(response.error || "Hodim qo'shishda xatolik");
          }
        },
      });
    }
  }

  const handleTypeChange = (memberType: MemberType) => {
    const currentTypes = form.getValues("type");
    if (currentTypes.includes(memberType)) {
      form.setValue(
        "type",
        currentTypes.filter((t) => t !== memberType)
      );
    } else {
      form.setValue("type", [...currentTypes, memberType]);
    }
  };

  return (
    <AlertDialog open={modal.open} onOpenChange={modal.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {modal.data === null ? "Hodim qo'shish" : "Hodimni yangilash"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Iltimos, {modal.data ? "hodimni yangilash" : "hodim qo'shish"} uchun
            kerakli maydonlarni {"to'ldiring"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <Label>Foydalanuvchining ID si</Label>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Foydalanuvchi ID..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type Field - Multiselect */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tur</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Card className="p-3 space-y-2 border">
                        {[MemberType.ACTOR, MemberType.TRANSLATOR].map(
                          (option) => {
                            const Icon = defineMemberTypeIcon(option);
                            const Type = defineMemberType(option);
                            return (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={option}
                                  checked={field.value.includes(option)}
                                  onCheckedChange={() =>
                                    handleTypeChange(option as MemberType)
                                  }
                                />
                                <label
                                  htmlFor={option}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex gap-1"
                                >
                                  {Type}
                                  <Icon className="w-4 h-4" />
                                </label>
                              </div>
                            );
                          }
                        )}
                      </Card>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  modal.setOpen(false);
                  modal.setData(null);
                }}
                type="button"
                variant={"outline"}
              >
                Bekor qilish
              </Button>
              <Button type="submit">Davom etish</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MemberModal;
