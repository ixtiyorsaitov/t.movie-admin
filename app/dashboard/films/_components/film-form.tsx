"use client";
import type React from "react";
import { filmFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilmType, type IFilm } from "@/types";
import { useForm } from "react-hook-form";
import type z from "zod";
import "./styles.css";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, UploadIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "@/components/ui/multi-select";
import { useSelectGenre } from "@/hooks/use-select-genre";

interface Props {
  initialData: IFilm | null;
  pageTitle: string;
}

const FilmForm = ({ initialData, pageTitle }: Props) => {
  // Background image states
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(initialData?.backgroundImage || null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  // Card image states
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(
    initialData?.image || null
  );
  const [cardFile, setCardFile] = useState<File | null>(null);

  const { setOpen } = useSelectGenre();

  const form = useForm<z.infer<typeof filmFormSchema>>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || FilmType.SERIES,
      published: initialData?.published || false,
    },
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  async function handleUpload(file: File) {
    // Upload files implementation
    // Return the uploaded file URL
    return "uploaded-file-url";
  }

  async function onSubmit(values: z.infer<typeof filmFormSchema>) {
    try {
      // let backgroundImageUrl = initialData?.backgroundImage || "";
      // let cardImageUrl = initialData?.image || "";

      // if (backgroundFile) {
      //   backgroundImageUrl = await handleUpload(backgroundFile);
      // }

      // if (cardFile) {
      //   cardImageUrl = await handleUpload(cardFile);
      // }

      // const filmData = {
      //   ...values,
      //   backgroundImage: backgroundImageUrl,
      //   cardImage: cardImageUrl,
      // };

      // console.log("Film data:", filmData);
      // Send to your API or Supabase table
    } catch (error) {
      console.error("Submit error:", error);
    }
  }

  const handleBackgroundFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setBackgroundFile(selectedFile);
    setBackgroundPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setCardFile(selectedFile);
    setCardPreviewUrl(URL.createObjectURL(selectedFile));
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
                {backgroundPreviewUrl && (
                  <Image
                    src={backgroundPreviewUrl || "/placeholder.svg"}
                    alt="Background Preview"
                    className="object-cover"
                    fill
                  />
                )}
                {backgroundPreviewUrl && (
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
                    !backgroundFile &&
                      !backgroundPreviewUrl &&
                      "border-2 border-dashed"
                  )}
                >
                  {!backgroundPreviewUrl && (
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
                    onChange={handleBackgroundFileChange}
                    className="hidden"
                  />
                </FormLabel>
              </div>
            </FormItem>

            {/* CARD IMAGE */}
            <FormItem>
              <FormLabel>Card image</FormLabel>
              <div className="w-full max-w-sm h-[300px] flex items-center justify-center rounded-md cursor-pointer relative overflow-hidden labelContainer">
                {cardPreviewUrl && (
                  <Image
                    src={cardPreviewUrl || "/placeholder.svg"}
                    alt="Card Preview"
                    className="object-cover"
                    fill
                  />
                )}
                {cardPreviewUrl && (
                  <div className="hoverContent rounded-md w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/40 backdrop-blur-[5px] transition">
                    <FormLabel
                      htmlFor="uploadcard"
                      className="flex items-center justify-center flex-col space-y-1 border bg-sidebar/40 text-white rounded-md px-6 py-3"
                    >
                      <UploadIcon className="!w-5 !h-5" />
                      <h1 className="mt-1 text-sm">Upload another</h1>
                    </FormLabel>
                  </div>
                )}
                <FormLabel
                  htmlFor="uploadcard"
                  className={cn(
                    "w-full h-full flex items-center justify-center labelContainer",
                    !cardFile && !cardPreviewUrl && "border-2 border-dashed"
                  )}
                >
                  {!cardPreviewUrl && (
                    <div className="flex flex-col items-center justify-center gap-3 sm:px-4">
                      <div className="rounded-full border border-dashed p-2">
                        <UploadIcon
                          className="text-muted-foreground size-5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-muted-foreground font-medium text-center text-sm">
                        Upload card image
                      </p>
                    </div>
                  )}
                  <Input
                    id="uploadcard"
                    type="file"
                    accept="image/*"
                    onChange={handleCardFileChange}
                    className="hidden"
                  />
                </FormLabel>
              </div>
              <FormDescription>
                This image will be used as the main card image for the film
                (recommended: 300x450px)
              </FormDescription>
            </FormItem>

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter film title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FILM TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Select film type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={FilmType.SERIES}>Series</SelectItem>
                      <SelectItem value={FilmType.MOVIE}>Movie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GENRES */}
            <div className="w-full">
              <Button
                type="button"
                variant={"outline"}
                className="w-full flex items-center justify-between"
                onClick={() => setOpen(true)}
              >
                <p>Select genres</p>
                <p className="text-muted-foreground">
                  <ChevronDown size={10} />
                </p>
              </Button>
              <MultiSelect
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
              />
            </div>

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter film description..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
              {initialData ? "Update Film" : "Create Film"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FilmForm;
