"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { INotification } from "@/types/notification";
import { NotificationType } from "@/types";
import { defineNotificationType } from "@/lib/utils";
import { notificationSchema } from "@/lib/validation";

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  defaultValues?: INotification | null;
}

export function NotificationForm({ defaultValues }: NotificationFormProps) {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: defaultValues?.type || NotificationType.SYSTEM,
      isGlobal: defaultValues?.isGlobal || false,
      userId: defaultValues?.user?._id || "",
      title: defaultValues?.title || "",
      message: defaultValues?.message || "",
      filmId: defaultValues?.film?._id || "",
      episodeId: defaultValues?.episode?._id || "",
      reviewReplyId: defaultValues?.reviewReply?._id || "",
      commentReplyId: defaultValues?.commentReply?._id || "",
      link: defaultValues?.link || "",
    },
  });

  const watchType = form.watch("type");
  const watchIsGlobal = form.watch("isGlobal");

  function onSubmit(data: NotificationFormValues) {
    console.log("Form submitted with values:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Type Select */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tur</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={field.value === "private"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NotificationType.SYSTEM}>
                    {defineNotificationType(NotificationType.SYSTEM)}
                  </SelectItem>
                  <SelectItem value={NotificationType.FILM}>
                    {defineNotificationType(NotificationType.FILM)}
                  </SelectItem>
                  <SelectItem
                    value={defineNotificationType(NotificationType.EPISODE)}
                  >
                    {defineNotificationType(NotificationType.EPISODE)}
                  </SelectItem>
                  <SelectItem
                    value={defineNotificationType(
                      NotificationType.REVIEW_REPLY
                    )}
                  >
                    {defineNotificationType(NotificationType.REVIEW_REPLY)}
                  </SelectItem>
                  <SelectItem value={NotificationType.COMMENT_REPLY}>
                    {defineNotificationType(NotificationType.COMMENT_REPLY)}
                  </SelectItem>
                  <SelectItem value={NotificationType.PRIVATE} disabled>
                    {defineNotificationType(NotificationType.PRIVATE)}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* isGlobal Switch */}
        <FormField
          control={form.control}
          name="isGlobal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Global bildirishnoma
                </FormLabel>
                <FormDescription>
                  Bu bildirishnomani barcha foydalanuvchilarga {"jo'nating"}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* User ID - only shown when isGlobal is false */}
        {!watchIsGlobal && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foydalanuvchi ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jo'natish kerak bo'lgan foydalanuvchining ID si"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ushbu bildirishnomani oluvchi foydalanuvchi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sarlavha</FormLabel>
              <FormControl>
                <Input placeholder="Bildirishnomaning sarvlahasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xabar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Bildirishnomaning xabari"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional ID Fields based on type */}
        {watchType === NotificationType.FILM && (
          <FormField
            control={form.control}
            name="filmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film ID</FormLabel>
                <FormControl>
                  <Input placeholder="Filmning ID sini kiriting" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchType === NotificationType.EPISODE && (
          <FormField
            control={form.control}
            name="episodeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Epizod ID</FormLabel>
                <FormControl>
                  <Input placeholder="Epizodning ID sini kiriting" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchType === NotificationType.REVIEW_REPLY && (
          <FormField
            control={form.control}
            name="reviewReplyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sharh ID</FormLabel>
                <FormControl>
                  <Input placeholder="Sharhning ID si" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchType === NotificationType.COMMENT_REPLY && (
          <FormField
            control={form.control}
            name="commentReplyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Izoh ID</FormLabel>
                <FormControl>
                  <Input placeholder="Izohning ID si" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Optional Link */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link (Ixtiyoriy)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  type="url"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Bildirishnoma uchun ixtiyoriy link
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {defaultValues
            ? "Bildirishnomani yangilash"
            : "Bildirishnoma yaratish"}
        </Button>
      </form>
    </Form>
  );
}
