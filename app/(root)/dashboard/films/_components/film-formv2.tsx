"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilmType, ICategory, IGenre } from "@/types";
import { IFilm } from "@/types/film";
import { generateSlug } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GenresSelectModal } from "@/components/modals/genre.modal";
import { useGenresSelectModal } from "@/hooks/use-modals";
import { useGenres } from "@/hooks/useGenre";
import { toast } from "sonner";
import { useCategories, useGetAllCategories } from "@/hooks/useCategory";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  type: z.nativeEnum(FilmType),
  slug: z.string().optional().or(z.literal("")),
  disableComments: z.boolean(),
  published: z.boolean(),
  genres: z.array(z.string()).min(1, "Kamida 1 ta janr tanlang"),
  category: z.string().min(1, "Kategoriyani tanlang"),
});

interface FilmFormProps {
  initialData: IFilm | null;
}

export function FilmFormV2({ initialData }: FilmFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const selectedGenresModal = useGenresSelectModal();
  const genresQuery = useGenres();
  const categoriesQuery = useCategories();
  console.log(categoriesQuery.data);

  useEffect(() => {
    if (!genresQuery.isLoading && genresQuery.data.success) {
      selectedGenresModal.setData(genresQuery.data.datas);
    }
  }, [genresQuery.data]);
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          type: initialData.type,
          slug: initialData.slug || "",
          disableComments: initialData.disableComments,
          published: initialData.published,
          genres: initialData.genres.map((g) => g._id || g._id || ""), // 🔥 shu joy muhim
          category: initialData.category?._id,
        }
      : {
          title: "",
          description: "",
          type: FilmType.MOVIE,
          slug: "",
          disableComments: false,
          published: false,
          genres: [],
          category: "",
        },
  });

  function onStep1Submit() {
    form.trigger(["title", "description", "type", "genres"]).then((isValid) => {
      if (!isValid) return;
      const values = form.getValues();
      console.log(values);
      toast.success("Hammasi joyida");

      //   setStep(2);
    });
  }

  function onFinalSubmit(values: z.infer<typeof formSchema>) {
    console.log("Film Form Values:", values);
    // Here you would normally send data to backend
  }

  function onGenresChange(genres: string[]) {
    form.setValue("genres", genres);
  }

  const selectedGenres = form.watch("genres");

  return (
    <>
      <div className="w-full py-3">
        <Card className="bg-transparent border-none p-0! shadow-none">
          <CardHeader>
            <CardTitle>
              <h1 className="text-3xl font-bold">
                {isEditing ? "Filmni tahrirlash" : "Film qo'shish"}
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onStep1Submit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomi *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter film title" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tavsif *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Filmga tavsif kiriting"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tur *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select film type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={FilmType.MOVIE}>
                                Kino
                              </SelectItem>
                              <SelectItem value={FilmType.SERIES}>
                                Serial
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="genres"
                      render={() => (
                        <FormItem>
                          <FormLabel>Genres *</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  selectedGenresModal.setOpen(true)
                                }
                                className="w-full justify-start pl-3"
                              >
                                Janrlarni tanlash
                              </Button>

                              {selectedGenres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedGenres.map((genreId) => {
                                    const foundGenre =
                                      selectedGenresModal.data.find(
                                        (c) => c._id === genreId
                                      );
                                    return (
                                      <Badge key={genreId} variant="secondary">
                                        {foundGenre?.name || genreId}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </FormControl>
                          {form.formState.errors.genres && (
                            <p className="text-sm text-destructive mt-1">
                              {form.formState.errors.genres.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategoriya *</FormLabel>
                          <FormControl>
                            <Select
                              disabled={categoriesQuery.isLoading}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    categoriesQuery.isLoading
                                      ? "Yuklanyapti"
                                      : "Kategoriya tanlang"
                                  }
                                />
                              </SelectTrigger>
                              {!categoriesQuery.isLoading &&
                                categoriesQuery.data?.success && (
                                  <SelectContent>
                                    {categoriesQuery.data?.datas.map(
                                      (cat: ICategory) => (
                                        <SelectItem
                                          key={cat._id}
                                          value={cat._id}
                                        >
                                          {cat.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                )}
                            </Select>
                          </FormControl>
                          {form.formState.errors.category && (
                            <p className="text-sm text-destructive mt-1">
                              {form.formState.errors.category.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slag (ixtiyoriy)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={generateSlug(form.watch("title"))}
                              {...field}
                            />
                          </FormControl>

                          <FormDescription>
                            {"Avtomatik yaratish uchun bo'sh qoldiring"}
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="disableComments"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Izohlarni {"o'chirish"}</FormLabel>
                            <FormDescription>
                              Foydalanuvchilarning ushbu filmga fikr
                              bildirishlariga yo‘l qo‘ymaslik
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

                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Nashr etish</FormLabel>
                            <FormDescription>
                              Ushbu filmni ommaga {"ko'rsating"}
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

                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">
                        Keyingi qadam
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slider image upload */}
                  <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700 p-12 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Slider Image
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                        Upload your slider/hero image here
                      </p>
                    </div>
                  </div>

                  {/* Preview image upload */}
                  <div className="rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 dark:bg-purple-950 dark:border-purple-700 p-12 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                        Preview Image
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-300 mt-2">
                        Upload your preview/thumbnail image here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Orqaga
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onFinalSubmit(form.getValues())}
                    className="flex-1"
                  >
                    {isEditing ? "Saqlash" : "Yaratish"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <GenresSelectModal
        initialData={selectedGenres}
        onGenresChange={onGenresChange}
        loading={genresQuery.isLoading}
        error={genresQuery.isLoading ? undefined : genresQuery.data.error}
      />
    </>
  );
}
