"use client";
import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filmFormSchema } from "@/lib/validation";
import { FilmType, type IFilm } from "@/types";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, Loader } from "lucide-react";
import MultiSelect from "@/components/ui/multi-select";
import { useSelectGenre } from "@/hooks/use-select-genre";
import { useFilmMutations } from "@/hooks/use-film-mutations";
import type { FilmFormProps, LoadingStep } from "@/types/film-form.types";
import type z from "zod";
import { createImagePreviewUrl } from "@/lib/supabase-utils";
import { UpdateLoadingModal } from "@/components/modals/loading-modals/update-loading-modal";
import { CreationLoadingModal } from "@/components/modals/loading-modals/creation-loading-modal";
import { ImageUploadField } from "@/components/form-fields/image-upload-field";

const FilmForm = ({ initialData, pageTitle }: FilmFormProps) => {
  // State management
  const [initialDataState, setInitialDataState] = useState<IFilm | null>(
    initialData
  );
  const [creatingStep, setCreatingStep] = useState<LoadingStep>(null);
  const [updatingStep, setUpdatingStep] = useState<LoadingStep>(null);

  // Image states
  const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<
    string | null
  >(initialDataState?.images.backgroundImage.url || null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(
    initialDataState?.images.image.url || null
  );
  const [cardFile, setCardFile] = useState<File | null>(null);

  // Genre selection
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialDataState ? initialDataState.genres.map((genre) => genre._id) : []
  );

  const selectGenreModal = useSelectGenre();

  // Form setup
  const form = useForm<z.infer<typeof filmFormSchema>>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: useMemo(
      () => ({
        title: initialDataState?.title || "",
        description: initialDataState?.description || "",
        type: initialDataState?.type || FilmType.SERIES,
        published: initialDataState?.published || false,
      }),
      [initialDataState]
    ),
  });

  // Success callbacks
  const handleCreateSuccess = useCallback(() => {
    form.reset();
    setSelectedGenres([]);
    setBackgroundFile(null);
    setBackgroundPreviewUrl(null);
    setCardFile(null);
    setCardPreviewUrl(null);
  }, [form]);

  const handleUpdateSuccess = useCallback((film: IFilm) => {
    setInitialDataState(film);
    setBackgroundFile(null);
    setCardFile(null);
  }, []);

  // Mutations
  const { createMutation, updateMutation, isLoading } = useFilmMutations({
    initialData: initialDataState,
    selectedGenres,
    backgroundFile,
    cardFile,
    setCreatingStep,
    setUpdatingStep,
    onCreateSuccess: handleCreateSuccess,
    onUpdateSuccess: handleUpdateSuccess,
  });

  // File handlers
  const handleBackgroundFileChange = useCallback((file: File | null) => {
    setBackgroundFile(file);
    setBackgroundPreviewUrl(file ? createImagePreviewUrl(file) : null);
  }, []);

  const handleCardFileChange = useCallback((file: File | null) => {
    setCardFile(file);
    setCardPreviewUrl(file ? createImagePreviewUrl(file) : null);
  }, []);

  const removeBackgroundImage = useCallback(() => {
    setBackgroundFile(null);
    setBackgroundPreviewUrl(
      initialDataState?.images.backgroundImage.url || null
    );
  }, [initialDataState]);

  const removeCardImage = useCallback(() => {
    setCardFile(null);
    setCardPreviewUrl(initialDataState?.images.image.url || null);
  }, [initialDataState]);

  // Form submission
  const onSubmit = useCallback(
    async (values: z.infer<typeof filmFormSchema>) => {
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
      }
    },
    [backgroundFile, cardFile, initialDataState, updateMutation, createMutation]
  );

  return (
    <>
      <CreationLoadingModal
        isOpen={creatingStep !== null}
        currentStep={creatingStep}
      />
      <UpdateLoadingModal
        isOpen={updatingStep !== null}
        currentStep={updatingStep}
      />

      <div className="w-full px-4 sm:px-6 lg:px-10 pt-5">
        <div className="w-full">
          <h1 className="font-bold text-2xl">{pageTitle}</h1>
        </div>
        <Separator className="mt-2 mb-6" />

        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Images Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ImageUploadField
                  label="Background Image"
                  description="Upload a high-quality background image for the film (recommended: 1920x1080px)"
                  previewUrl={backgroundPreviewUrl}
                  onFileChange={handleBackgroundFileChange}
                  onRemove={removeBackgroundImage}
                  isLoading={isLoading}
                  className="lg:col-span-2"
                  aspectRatio="h-[300px] sm:h-[400px] lg:h-[500px]"
                  inputId="uploadbg"
                />

                <ImageUploadField
                  label="Card Image"
                  description="Upload the main poster image (recommended: 300x450px)"
                  previewUrl={cardPreviewUrl}
                  onFileChange={handleCardFileChange}
                  onRemove={removeCardImage}
                  isLoading={isLoading}
                  className="lg:col-span-1"
                  aspectRatio="aspect-[2/3] max-w-[300px] mx-auto lg:mx-0"
                  inputId="uploadcard"
                />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Enter film title..."
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Select film type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={FilmType.SERIES}>
                              Series
                            </SelectItem>
                            <SelectItem value={FilmType.MOVIE}>
                              Movie
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="text-base font-semibold">
                      Genres
                    </FormLabel>
                    {!isLoading && (
                      <Dialog
                        open={selectGenreModal.open}
                        onOpenChange={selectGenreModal.setOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 flex items-center justify-between bg-transparent"
                            disabled={isLoading}
                          >
                            <span>
                              {selectedGenres.length > 0
                                ? `${selectedGenres.length} genre${
                                    selectedGenres.length > 1 ? "s" : ""
                                  } selected`
                                : "Select genres"}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Select Genres</DialogTitle>
                            <DialogDescription>
                              Choose the genres that best describe this film.
                            </DialogDescription>
                          </DialogHeader>
                          <MultiSelect
                            selectedGenres={selectedGenres}
                            setSelectedGenres={setSelectedGenres}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={isLoading}
                            placeholder="Enter film description..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">
                            Published
                          </FormLabel>
                          <FormDescription>
                            Make this film visible to the public.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isLoading}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {initialData ? "Update Film" : "Create Film"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default FilmForm;
