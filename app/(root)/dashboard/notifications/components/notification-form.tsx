"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
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
import type { INotification } from "@/types/notification";
import { NotificationSendingType, NotificationType } from "@/types";
import {
  defineNotificationSendingType,
  defineNotificationType,
  getLettersOfName,
} from "@/lib/utils";
import { notificationSchema } from "@/lib/validation";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserByIdOnlyQuickInfo } from "@/hooks/useUsers";
import FindingUserSkeleton from "./skeletons/finding-user.skeleton";
import { useGetFilmByIdOnlyQuickInfo } from "@/hooks/useFilms";
import FindingFilmSkeleton from "./skeletons/finding-film.skeleton";
import ReadOnlyStars from "@/components/core/read-ony-react-stars";
import { useGetReviewById } from "@/hooks/useReviews";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

type NotificationFormValues = z.infer<typeof notificationSchema>;

interface NotificationFormProps {
  defaultValues?: INotification | null;
  loading: boolean;
  onSubmit: (values: NotificationFormValues) => void;
}

export function NotificationForm({
  defaultValues,
  onSubmit,
  loading,
}: NotificationFormProps) {
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: defaultValues?.type || NotificationType.SYSTEM,
      title: defaultValues?.title || "",
      message: defaultValues?.message || "",
      filmId: defaultValues?.film?._id || "",
      episodeId: defaultValues?.episode?._id || "",
      reviewId: defaultValues?.reviewReply?._id || "",
      commentId: defaultValues?.commentReply?._id || "",
      sendingType: defaultValues?.sending.type || NotificationSendingType.ALL,
      sendingFilmId: defaultValues?.sending.film || "",
      sendingUserId: defaultValues?.sending.user || "",
      link: defaultValues?.link || "",
    },
  });

  const [debouncedSendingUserId, setDebouncedSendingUserId] = useState(
    defaultValues?.sending?.user || ""
  );
  const [debouncedFilmId, setDebouncedFilmId] = useState(
    defaultValues?.film?._id || ""
  );
  const [debouncedSendingFilmId, setDebouncedSendingFilmId] = useState(
    defaultValues?.sending.film || ""
  );
  const [debouncedReviewId, setDebouncedReviewId] = useState(
    defaultValues?.reviewReply?._id || ""
  );

  const watchType = form.watch("type");
  const watchFilmId = form.watch("filmId");
  const watchReviewId = form.watch("reviewId");

  const watchSendingType = form.watch("sendingType");
  const watchSendingFilmId = form.watch("sendingFilmId");
  const watchSendingUserId = form.watch("sendingUserId");

  // This ensures the state only updates after the user stops typing for 500ms
  const debouncedSetUserId = useCallback(
    debounce((value) => setDebouncedSendingUserId(value), 500),
    []
  );
  const debouncedSetFilmId = useCallback(
    debounce((value) => setDebouncedFilmId(value), 500),
    []
  );
  const debouncedSetSendingFilmId = useCallback(
    debounce((value) => setDebouncedSendingFilmId(value), 500),
    []
  );
  const debouncedSetReviewId = useCallback(
    debounce((value) => setDebouncedReviewId(value), 500),
    []
  );

  useEffect(() => {
    debouncedSetUserId(watchSendingUserId);
  }, [watchSendingUserId, debouncedSetUserId]);

  useEffect(() => {
    debouncedSetFilmId(watchFilmId);
  }, [watchFilmId, debouncedSetFilmId]);

  useEffect(() => {
    debouncedSetSendingFilmId(watchSendingFilmId);
  }, [watchSendingFilmId, debouncedSetSendingFilmId]);

  useEffect(() => {
    debouncedSetReviewId(watchReviewId);
  }, [watchReviewId, debouncedSetReviewId]);

  // This prevents the query from firing on every keystroke
  const getUserByIdOnlyQuickInfoQuery = useGetUserByIdOnlyQuickInfo(
    debouncedSendingUserId || null
  );
  const getFilmByIdOnlyQuickInfoQuery = useGetFilmByIdOnlyQuickInfo(
    debouncedFilmId || null
  );
  const getFilmByIdOnlyQuickInfoQueryForSendingFilm =
    useGetFilmByIdOnlyQuickInfo(debouncedSendingFilmId || null);
  const getReviewByIdQuery = useGetReviewById(debouncedReviewId || null);

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
                disabled={field.value === "private" || loading}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent align="center">
                  <SelectItem value={NotificationType.SYSTEM}>
                    {defineNotificationType(NotificationType.SYSTEM)}
                  </SelectItem>
                  <SelectItem value={NotificationType.FILM}>
                    {defineNotificationType(NotificationType.FILM)}
                  </SelectItem>
                  <SelectItem value={NotificationType.EPISODE}>
                    {defineNotificationType(NotificationType.EPISODE)}
                  </SelectItem>
                  <SelectItem value={NotificationType.REVIEW_REPLY}>
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

        {watchType === NotificationType.FILM && (
          <FormField
            control={form.control}
            name="filmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film ID</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Filmning ID sini kiriting"
                    {...field}
                  />
                </FormControl>

                {getFilmByIdOnlyQuickInfoQuery.isLoading ? (
                  <FindingFilmSkeleton />
                ) : (
                  getFilmByIdOnlyQuickInfoQuery.data && (
                    <>
                      {getFilmByIdOnlyQuickInfoQuery.data.success ? (
                        <div className="flex items-center justify-start gap-2">
                          <Avatar className="border border-primary w-11 h-15 rounded-lg">
                            <AvatarImage
                              src={
                                getFilmByIdOnlyQuickInfoQuery.data.data.images
                                  .image.url || "/placeholder.svg"
                              }
                              className="object-cover rounded-none"
                              alt="film"
                            />
                            <AvatarFallback className="rounded-none">
                              {getLettersOfName(
                                getFilmByIdOnlyQuickInfoQuery.data.data.name
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h1 className="text-sm font-semibold">
                              {getFilmByIdOnlyQuickInfoQuery.data.data.title}
                            </h1>
                            <ReadOnlyStars value={4} size={15} />
                          </div>
                        </div>
                      ) : (
                        <p className="text-destructive text-xs">
                          {getFilmByIdOnlyQuickInfoQuery.data.error}
                        </p>
                      )}
                    </>
                  )
                )}
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
                  <Input
                    disabled={loading}
                    placeholder="Epizodning ID sini kiriting"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchType === NotificationType.REVIEW_REPLY && (
          <FormField
            control={form.control}
            name="reviewId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sharh ID</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Sharhning ID si"
                    {...field}
                  />
                </FormControl>
                {getReviewByIdQuery.isLoading ? (
                  <h1>Loading..</h1>
                ) : (
                  getReviewByIdQuery.data && (
                    <>
                      {getReviewByIdQuery.data.success ? (
                        <div className="bg-secondary rounded-lg p-2">
                          <div className="flex items-center justify-start gap-2">
                            <Avatar className="border border-primary w-11 h-11">
                              <AvatarImage
                                src={
                                  getReviewByIdQuery.data.data.user.avatar ||
                                  "/placeholder.svg"
                                }
                                alt="user"
                              />
                              <AvatarFallback>
                                {getLettersOfName(
                                  getReviewByIdQuery.data.data.user
                                    .name as string
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h1 className="text-sm">
                                {getReviewByIdQuery.data.data.user.name}
                              </h1>
                            </div>
                          </div>
                          <p className="mt-2 text-sm">
                            {getReviewByIdQuery.data.data.text ?? (
                              <Badge variant={"destructive"}>
                                {"Fikr yo'q"}
                              </Badge>
                            )}
                          </p>
                          <Separator className="my-2" />
                          <div className="w-full text-muted-foreground text-xs flex items-center justify-between">
                            <ReadOnlyStars
                              value={getReviewByIdQuery.data.data.rating}
                              size={15}
                            />
                            <p>
                              {format(
                                new Date(
                                  getReviewByIdQuery.data.data.createdAt
                                ),
                                "PPpp"
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-destructive text-xs">
                          {getReviewByIdQuery.data.error}
                        </p>
                      )}
                    </>
                  )
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchType === NotificationType.COMMENT_REPLY && (
          <FormField
            control={form.control}
            name="commentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Izoh ID</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Izohning ID si"
                    {...field}
                  />
                </FormControl>
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
                <Input
                  disabled={loading}
                  placeholder="Bildirishnomaning sarvlahasi"
                  {...field}
                />
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
                  disabled={loading}
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

        {/* Optional Link */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link (Ixtiyoriy)</FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
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

        <Separator />

        <h1 className="text-2xl font-bold">Kimga yuborilsin?</h1>

        <FormField
          control={form.control}
          name="sendingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{"Jo'natilish turi"}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Jo'natilish turi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NotificationSendingType.ALL}>
                    {defineNotificationSendingType(NotificationSendingType.ALL)}
                  </SelectItem>
                  <SelectItem value={NotificationSendingType.USER}>
                    {defineNotificationSendingType(
                      NotificationSendingType.USER
                    )}
                  </SelectItem>
                  <SelectItem value={NotificationSendingType.FILM_SUBSCRIBERS}>
                    {defineNotificationSendingType(
                      NotificationSendingType.FILM_SUBSCRIBERS
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchSendingType === NotificationSendingType.USER && (
          <FormField
            control={form.control}
            name="sendingUserId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foydalanuvchi ID</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Jo'natish kerak bo'lgan foydalanuvchining ID si"
                    {...field}
                  />
                </FormControl>
                {getUserByIdOnlyQuickInfoQuery.isLoading ? (
                  <FindingUserSkeleton />
                ) : (
                  getUserByIdOnlyQuickInfoQuery.data && (
                    <>
                      {getUserByIdOnlyQuickInfoQuery.data.success ? (
                        <div className="flex items-center justify-start gap-2">
                          <Avatar className="border border-primary w-11 h-11">
                            <AvatarImage
                              src={
                                getUserByIdOnlyQuickInfoQuery.data.data
                                  .avatar || "/placeholder.svg"
                              }
                              alt="user"
                            />
                            <AvatarFallback>
                              {getLettersOfName(
                                getUserByIdOnlyQuickInfoQuery.data.data
                                  .name as string
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h1 className="text-sm">
                              {getUserByIdOnlyQuickInfoQuery.data.data.name}
                            </h1>
                            <p className="text-muted-foreground text-xs">
                              {getUserByIdOnlyQuickInfoQuery.data.data.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-destructive text-xs">
                          {getUserByIdOnlyQuickInfoQuery.data.error}
                        </p>
                      )}
                    </>
                  )
                )}
                <FormDescription>
                  Ushbu bildirishnomani oluvchi foydalanuvchi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchSendingType === NotificationSendingType.FILM_SUBSCRIBERS && (
          <FormField
            control={form.control}
            name="sendingFilmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film ID</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Filmning ID sini kiriting"
                    {...field}
                  />
                </FormControl>

                {getFilmByIdOnlyQuickInfoQueryForSendingFilm.isLoading ? (
                  <FindingFilmSkeleton />
                ) : (
                  getFilmByIdOnlyQuickInfoQueryForSendingFilm.data && (
                    <>
                      {getFilmByIdOnlyQuickInfoQueryForSendingFilm.data
                        .success ? (
                        <div className="flex items-center justify-start gap-2">
                          <Avatar className="border border-primary w-11 h-15 rounded-lg">
                            <AvatarImage
                              src={
                                getFilmByIdOnlyQuickInfoQueryForSendingFilm.data
                                  .data.images.image.url || "/placeholder.svg"
                              }
                              className="object-cover rounded-none"
                              alt="film"
                            />
                            <AvatarFallback className="rounded-none">
                              {getLettersOfName(
                                getFilmByIdOnlyQuickInfoQueryForSendingFilm.data
                                  .data.name
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h1 className="text-sm font-semibold">
                              {
                                getFilmByIdOnlyQuickInfoQueryForSendingFilm.data
                                  .data.title
                              }
                            </h1>
                            <ReadOnlyStars value={4} size={15} />
                          </div>
                        </div>
                      ) : (
                        <p className="text-destructive text-xs">
                          {
                            getFilmByIdOnlyQuickInfoQueryForSendingFilm.data
                              .error
                          }
                        </p>
                      )}
                    </>
                  )
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button disabled={loading} type="submit" className="w-full">
          {defaultValues
            ? "Bildirishnomani yangilash"
            : "Bildirishnoma yaratish"}
          {loading && <Spinner />}
        </Button>
      </form>
    </Form>
  );
}
