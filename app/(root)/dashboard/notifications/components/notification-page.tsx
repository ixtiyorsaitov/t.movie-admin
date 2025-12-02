"use client";

import { INotification } from "@/types/notification";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationForm } from "./notification-form";
import { notificationSchema } from "@/lib/validation";
import z from "zod";
import {
  useCreateNotification,
  useUpdateNotification,
} from "@/hooks/useNotifications";
import { toast } from "sonner";

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface Props {
  data: INotification | null;
}

const NotificationPageMain = ({ data: defaultValue }: Props) => {
  const isEditing = !!defaultValue;
  const createMutation = useCreateNotification();
  const updateMutation = useUpdateNotification();
  const onSubmit = (values: NotificationFormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        {
          data: {
            ...values,
            filmId: values.filmId?.trim() ?? null,
            episodeId: values.episodeId?.trim() ?? null,
            reviewId: values.reviewId?.trim() ?? null,
            commentId: values.commentId?.trim() ?? null,
          },
          id: defaultValue._id,
        },
        {
          onSuccess: (res) => {
            console.log(res);
            if (res.success) {
              toast.success(res.message);
            } else {
              toast.error(res.error);
            }
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          ...values,
          filmId: values.filmId?.trim() ?? null,
          episodeId: values.episodeId?.trim() ?? null,
          reviewId: values.reviewId?.trim() ?? null,
          commentId: values.commentId?.trim() ?? null,
        },
        {
          onSuccess: (res) => {
            console.log(res);
            if (res.success) {
              toast.success(res.message);
              setTimeout(() => {
                window.location.href = "/dashboard/notifications";
              }, 1000);
            } else {
              toast.error(res.error);
            }
          },
        }
      );
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;
  return (
    <div className="mx-auto">
      <Card className="w-full bg-transparent border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {isEditing
              ? "Bildirishnomani tahrirlash"
              : "Bildirishnoma yaratish"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationForm
            loading={loading}
            defaultValues={defaultValue}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPageMain;
