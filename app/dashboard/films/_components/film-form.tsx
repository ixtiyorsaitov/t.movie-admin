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
import { ChevronDown, Loader, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@supabase/supabase-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "@/components/ui/multi-select";
import { v4 as uuidv4 } from "uuid";
import { useSelectGenre } from "@/hooks/use-select-genre";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";

interface Props {
  initialData: IFilm | null;
  pageTitle: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FilmForm = ({ initialData, pageTitle }: Props) => {
  // Background image states
  const [initialDataState, setInitialDataState] = useState<null | IFilm>(
    initialData
  );
  const [creatingStep, setCreatingStep] = useState<1 | 2 | 3 | "final" | null>(
    null
  );
  const [updatingStep, setUpdatingStep] = useState<1 | 2 | 3 | "final" | null>(
    null
  );
  const [updatedUrls, setUpdatedUrls] = useState<{
    backgroundImage: {
      name: string;
      url: string;
    };
    image: {
      name: string;
      url: string;
    };
  }>({
    backgroundImage: {
      name: "",
      url: "",
    },
    image: {
      name: "",
      url: "",
    },
  });
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(initialDataState?.images.backgroundImage.url || null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  // Card image states
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(
    initialDataState?.images.image.url || null
  );
  const [cardFile, setCardFile] = useState<File | null>(null);

  const selectGenreModal = useSelectGenre();

  const form = useForm<z.infer<typeof filmFormSchema>>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: {
      title: initialDataState?.title || "",
      description: initialDataState?.description || "",
      type: initialDataState?.type || FilmType.SERIES,
      published: initialDataState?.published || false,
    },
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  async function handleUpload(file: File, bucketName: string) {
    // Upload files implementation
    // Return the uploaded file URL

    const fileName = uuidv4();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    if (error) {
      return { success: false };
    }
    if (data) {
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return {
        success: true,
        url: urlData.publicUrl,
        fileName: fileName,
      };
    }
  }
  async function handleRemoveImage(fileName: string[], bucketName: string) {
    // Upload files implementation
    // Return the uploaded file URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(fileName);
    if (error) {
      console.log(error);
      return { success: false };
    }
    return {
      success: true,
    };
  }

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      if (backgroundFile && initialDataState) {
        const removedBg = (await handleRemoveImage(
          [initialDataState.images.backgroundImage.name],
          "backgrounds"
        )) as { success: boolean };
        if (!removedBg.success) return setUpdatingStep(null);
        const uploadedBg = (await handleUpload(
          backgroundFile,
          "backgrounds"
        )) as {
          url: string;
          fileName: string;
          success: boolean;
        };
        if (!uploadedBg.success) return setUpdatingStep(null);

        setInitialDataState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            images: {
              ...prev.images,
              backgroundImage: {
                name: uploadedBg.fileName,
                url: uploadedBg.url,
              },
            },
          };
        });
      }
      if (cardFile && initialDataState) {
        const removedImg = (await handleRemoveImage(
          [initialDataState.images.image.name],
          "images"
        )) as { success: boolean };
        if (!removedImg.success) return setUpdatingStep(null);
        const uploadedImg = (await handleUpload(cardFile, "images")) as {
          url: string;
          fileName: string;
          success: boolean;
        };
        if (!uploadedImg.success) return setUpdatingStep(null);
        setInitialDataState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            images: {
              ...prev.images,
              image: {
                name: uploadedImg.fileName,
                url: uploadedImg.url,
              },
            },
          };
        });
      }
      console.log(initialDataState);
      const formData = {
        ...initialDataState,
        ...values,
        genres: selectedGenres,
      };
      console.log(formData);

      const { data } = await axios.put(
        `/api/film/${initialDataState?._id}`,
        formData
      );
      console.log(data);

      if (data.success) {
        toast.success("Film updated successfuly!");
        setInitialDataState(data.film);
        setBackgroundFile(null);
        setBackgroundPreviewUrl(null);
        setCardFile(null);
        setCardPreviewUrl(null);
      } else {
        toast.error(data.error);
      }
      return data;
    },
    onSuccess: (res) => {
      console.log(res);
    },
  });
  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof filmFormSchema>) => {
      setCreatingStep(1);
      const { data: createdData } = await axios.post("/api/film", {
        ...values,
        genres: selectedGenres,
      });
      if (!createdData.success) {
        setCreatingStep(null);
        toast.error(createdData.error);
        return;
      }
      setCreatingStep(2);

      const uploadBg = (await handleUpload(backgroundFile!, "backgrounds")) as {
        url: string;
        fileName: string;
        success: boolean;
      };
      if (!uploadBg.success) {
        setCreatingStep(null);
        return toast.error("Something went wrong with upload background image");
      }
      const uploadImg = (await handleUpload(cardFile!, "images")) as {
        url: string;
        fileName: string;
        success: boolean;
      };
      if (!uploadImg.success) {
        setCreatingStep(null);
        return toast.error("Something went wrong with upload image");
      }
      setCreatingStep(3);
      const finallyFormData = {
        ...values,
        genres: selectedGenres,
        images: {
          backgroundImage: {
            name: uploadBg.fileName,
            url: uploadBg.url,
          },
          image: {
            name: uploadImg.fileName,
            url: uploadImg.url,
          },
        },
      };
      const { data: finallyData } = await axios.put(
        "/api/film",
        finallyFormData
      );

      if (finallyData.success) {
        setCreatingStep("final");
        toast.success("Film created successfully!");
        form.reset();
        setSelectedGenres([]);
        setBackgroundFile(null);
        setBackgroundPreviewUrl(null);
        setCardFile(null);
        setCardPreviewUrl(null);
      }

      return finallyData;
    },
    onSuccess: (res) => {
      console.log(res);
    },
  });

  async function onSubmit(values: z.infer<typeof filmFormSchema>) {
    try {
      if (!backgroundFile && !initialDataState) return;
      if (!cardFile && !initialDataState) return;
      if (initialDataState) {
        updateMutation.mutate(values);
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Submit error");
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
  useEffect(() => {
    console.log(creatingStep);
  }, [creatingStep]);

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
                  <div
                    className={cn(
                      "hoverContent rounded-md w-full h-full absolute top-0 left-0 items-center justify-center bg-black/40 backdrop-blur-[5px] transition",
                      createMutation.isPending || updateMutation.isPending
                        ? "hidden"
                        : "flex"
                    )}
                  >
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
                      "border-2 border-dashed",
                    createMutation.isPending || updateMutation.isPending
                      ? "hidden"
                      : "flex"
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
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
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
                {cardPreviewUrl &&
                  !(createMutation.isPending && updateMutation.isPending) && (
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
                    "w-full h-full items-center justify-center labelContainer",
                    !cardFile && !cardPreviewUrl && "border-2 border-dashed",
                    createMutation.isPending || updateMutation.isPending
                      ? "hidden"
                      : "flex"
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
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
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
                    <Input
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      placeholder="Enter film title..."
                      {...field}
                    />
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
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
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
              {!(createMutation.isPending && updateMutation.isPending) && (
                <Dialog
                  open={selectGenreModal.open}
                  onOpenChange={selectGenreModal.setOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className="w-full flex items-center justify-between"
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                    >
                      <p>Select genres</p>
                      <p className="text-muted-foreground">
                        <ChevronDown size={10} />
                      </p>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle />
                      <DialogDescription />
                    </DialogHeader>
                    <MultiSelect
                      selectedGenres={selectedGenres}
                      setSelectedGenres={setSelectedGenres}
                    />
                  </DialogContent>
                </Dialog>
              )}
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
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
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
                      disabled={
                        createMutation.isPending || updateMutation.isPending
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {initialData ? "Update Film" : "Create Film"}
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader className="animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FilmForm;
