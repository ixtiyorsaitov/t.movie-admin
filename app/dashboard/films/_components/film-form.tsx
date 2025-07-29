"use client";

import { filmFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilmType, IFilm } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import "./styles.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { GENRES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
// import { supabase } from "@/lib/supabase"; // bu yerni o'z path'ing bo'yicha tuzat

interface Props {
  initialData: IFilm | null;
  pageTitle: string;
}

const FilmForm = ({ initialData, pageTitle }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof filmFormSchema>>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || FilmType.SERIES,
      genres: initialData?.genres?.map((genre) => genre._id) || [],
      published: initialData?.published || false,
    },
  });

  async function handleUpload(file: File) {
    // Upload files
  }

  async function onSubmit(values: z.infer<typeof filmFormSchema>) {
    if (!file) return console.warn("No file selected");

    const imageUrl = await handleUpload(file);

    console.log({ ...values, backgroundImage: imageUrl });
    // You can send to your API or Supabase table now
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  return (
    <div className="w-full px-10 pt-5">
      <div className="w-full">
        <h1 className="font-bold text-2xl">{pageTitle}</h1>
      </div>
      <Separator className="mt-2 mb-4" />
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* BACKGROUND IMAGE */}
            <FormItem>
              <FormLabel>Background image</FormLabel>
              <div className="w-full h-[500px] flex items-center justify-center rounded-md cursor-pointer relative overflow-hidden labelContainer">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="object-cover"
                    fill
                  />
                )}
                {previewUrl && (
                  <div className="hoverContent rounded-md w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/40 backdrop-blur-[5px] transition">
                    <FormLabel
                      htmlFor="uploadbg"
                      className="flex items-center justify-center flex-col space-y-1 border bg-sidebar/40 text-white rounded-md px-10 py-4"
                    >
                      <UploadIcon className="!w-7 !h-7" />
                      <h1 className="mt-2 text-md">Upload another image</h1>
                    </FormLabel>
                  </div>
                )}
                <FormLabel
                  htmlFor="uploadbg"
                  className={cn(
                    "w-full h-full flex items-center justify-center labelContainer",
                    !file && "border-2 border-dashed "
                  )}
                >
                  {!previewUrl && !initialData && (
                    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                      <div className="rounded-full border border-dashed p-3">
                        <UploadIcon
                          className="text-muted-foreground size-7"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-muted-foreground font-medium text-center">
                        Upload background image
                      </p>
                    </div>
                  )}
                  <Input
                    id="uploadbg"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </FormLabel>
              </div>
            </FormItem>

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* GENRES */}
            <FormField
              control={form.control}
              name="genres"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Genres</FormLabel>
                    <FormDescription>
                      Select the genres that apply to this film.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* {GENRES.map((genre, idx) => (
                      <FormField
                        key={idx}
                        control={form.control}
                        name="genres"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={genre._id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(genre._id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          genre._id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== genre._id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {genre.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))} */}
                  </div>
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* PUBLISHED */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Published</FormLabel>
                    <FormDescription>
                      Make this film visible to the public.
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

            {/* SUBMIT */}
            <Button type="submit" className="w-full">
              {initialData ? "Save" : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FilmForm;
