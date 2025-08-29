"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUCKETS, type INews } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { newsSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import { TagsInput } from "@/components/ui/tags-input";
import { useState } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { removeImage, uploadImage } from "@/lib/supabase-utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NewsFormProps {
  initialData?: INews | null;
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [hasExpireAt, setHasExpireAt] = useState(
    initialData?.expireAt ? true : false
  );
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: initialData ? initialData.title : "",
      description: initialData ? initialData.description : "",
      content: initialData ? initialData.content : "",
      published: initialData ? initialData.published : false,
      // expireAt: initialData?.expireAt ? new Date(initialData.expireAt) : null,
      tags: initialData ? initialData.tags : [],
    },
    mode: "onSubmit",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
  };

  const createMutation = useMutation({
    mutationFn: async (values: INews) => {
      if (imageFile) {
        const uploadedImage = await uploadImage(imageFile, BUCKETS.NEWS);
        if (!uploadedImage.success) return;
        const { data: res } = await api.post("/news", {
          ...values,
          image: { url: uploadedImage.url, name: uploadedImage.fileName },
        });
        return res;
      } else {
        const { data: res } = await api.post("/news", values);
        return res;
      }
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Maqola muvaffaqiyatli yaratildi");
        router.push("/dashboard/news");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: INews) => {
      if (imageFile) {
        const uploadedImage = await uploadImage(imageFile, BUCKETS.NEWS);
        if (!uploadedImage.success) return;

        if (initialData?.image?.name) {
          await removeImage([initialData.image.name], BUCKETS.NEWS);
        }

        const { data: res } = await api.put(`/news/${initialData?._id}`, {
          ...values,
          expireAt: hasExpireAt ? values.expireAt : null,
          image: { url: uploadedImage.url, name: uploadedImage.fileName },
        });
        return res;
      }

      if (isImageRemoved) {
        if (initialData?.image?.name) {
          await removeImage([initialData.image.name], BUCKETS.NEWS);
        }

        const { data: res } = await api.put(`/news/${initialData?._id}`, {
          ...values,
          expireAt: hasExpireAt ? values.expireAt : null,
          image: null,
        });
        return res;
      }

      const { data: res } = await api.put(`/news/${initialData?._id}`, {
        ...values,
        expireAt: hasExpireAt ? values.expireAt : null,
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Maqola muvaffaqiyatli yangilandi");
        router.push("/dashboard/news");
      }
    },
  });

  function handleSubmit(values: z.infer<typeof newsSchema>) {
    if (initialData) {
      updateMutation.mutate(values as INews);
    } else {
      createMutation.mutate(values as INews);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Sarvlaha *</FormLabel>
                      <FormControl>
                        <Input
                          disabled={
                            updateMutation.isPending || createMutation.isPending
                          }
                          placeholder="Maqola sarvlahasini kiritng"
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
                    <FormItem className="space-y-2">
                      <FormLabel>Tavsif *</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={
                            updateMutation.isPending || createMutation.isPending
                          }
                          placeholder="Maqola tavsifini kiriting"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Mazmuni *</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={
                            updateMutation.isPending || createMutation.isPending
                          }
                          placeholder="Maqola mazmunini kiriting"
                          rows={10}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teglar *</FormLabel>
                      <FormControl>
                        {!updateMutation.isPending &&
                          !createMutation.isPending && (
                            <TagsInput
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Enter your tags"
                            />
                          )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Maqola rasmi{" "}
                  <span className="text-muted-foreground text-sm">
                    (ixtiyoriy)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-input border-dashed rounded-lg cursor-pointer"
                    >
                      {imageFile || (initialData?.image && !isImageRemoved) ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={
                              imageFile
                                ? imagePreview
                                : initialData?.image
                                ? initialData?.image?.url
                                : ""
                            }
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                            fill
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview("");
                              setImageFile(null);
                              setIsImageRemoved(true);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground font-semibold">
                            Yulash uchun bosing
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            PNG, JPG yoki JPEG (MAX. 5MB)
                          </p> */}
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={
                          updateMutation.isPending || createMutation.isPending
                        }
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{"Qo'chimcha"} sozlamalar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Nashr etish</FormLabel>
                      <FormControl>
                        <Switch
                          disabled={
                            updateMutation.isPending || createMutation.isPending
                          }
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="expireAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full gap-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>{"O'chib"} ketish vaqti</FormLabel>
                        <Switch
                          disabled={
                            updateMutation.isPending || createMutation.isPending
                          }
                          checked={hasExpireAt}
                          onCheckedChange={setHasExpireAt}
                        />
                      </div>

                      {hasExpireAt && (
                        <SmartDatetimeInput
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="e.g. Tomorrow morning 9am"
                          disabled={
                            updateMutation.isPending || createMutation.isPending
                          }
                          futureOnly
                        />
                      )}

                      <FormDescription>
                        Agar qanchadir vaqtdan keyin avtomatik {"o'chib"}{" "}
                        ketishini xoxlasangiz, bu maydonga vaqt kiriting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button
                    disabled={
                      updateMutation.isPending || createMutation.isPending
                    }
                    type="submit"
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {initialData ? "Maqolani yangilash" : "Maqola yaratish"}
                    {(updateMutation.isPending || createMutation.isPending) && (
                      <Loader2 className="animate-spin" />
                    )}
                  </Button>
                  {initialData && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full"
                      disabled={
                        updateMutation.isPending || createMutation.isPending
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Maqolani {"o'chirish"}
                    </Button>
                  )}
                  {updateMutation.isPending || createMutation.isPending ? (
                    <Button
                      disabled
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Link href="/dashboard/news" className="block">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Cancel
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
