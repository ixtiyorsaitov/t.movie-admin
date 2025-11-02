"use client";
import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filmFormSchema } from "@/lib/validation";
import { FilmType } from "@/types";
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
import type { FilmFormProps, LoadingStep } from "@/types/film-form.types";
import type z from "zod";
import { createImagePreviewUrl } from "@/lib/supabase-utils";
import { UpdateLoadingModal } from "@/components/modals/loading-modals/update-loading-modal";
import { CreationLoadingModal } from "@/components/modals/loading-modals/creation-loading-modal";
import { ImageUploadField } from "@/components/form-fields/image-upload-field";
import { useCreateFilmMutation, useUpdateFilmMutation } from "@/hooks/useFilms";
import { toast } from "sonner";
import { IFilm } from "@/types/film";
import SelectCategory from "./select-category";
import FilmMembersSection from "./film-members-section";

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
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialDataState ? initialDataState.category : ""
  );
  const [selectedActors, setSelectedActors] = useState<string[]>(
    initialDataState ? initialDataState.actors?.map((actor) => actor._id) : []
  );
  const [selectedTranslators, setSelectedTranslators] = useState<string[]>(
    initialDataState
      ? initialDataState.translators?.map((translator) => translator._id)
      : []
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

  const createMutation = useCreateFilmMutation({
    backgroundFile,
    cardFile,
    setCreatingStep,
    selectedGenres,
    selectedCategory,
  });
  const updateMutation = useUpdateFilmMutation({
    backgroundFile,
    cardFile,
    setUpdatingStep,
    selectedGenres,
    initialData,
    selectedCategory,
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
          updateMutation.mutate(values, {
            onSuccess: (finalData) => {
              if (finalData.success) {
                setUpdatingStep("final");
                toast.success("Film muvaffaqiyatli yangilandi!");

                setTimeout(() => {
                  setUpdatingStep(null);
                  handleUpdateSuccess(finalData.film);
                }, 2000);
              } else {
                setUpdatingStep(null);
                toast.error(finalData.error);
                throw new Error(finalData.error);
              }
            },
          });
        } else {
          createMutation.mutate(values, {
            onSuccess: (finalData) => {
              if (finalData.success) {
                setCreatingStep("final");
                toast.success("Film muvaffaqiyatli yaratildi!");

                setTimeout(() => {
                  setCreatingStep(null);
                  handleCreateSuccess();
                }, 2000);
              }
            },
          });
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
                  label="Slider rasmi"
                  description="Orqa fon va slider uchun sifatliroq katta hajmdagi rasm yulang (tavsiya: 1920x1080px)"
                  previewUrl={backgroundPreviewUrl}
                  onFileChange={handleBackgroundFileChange}
                  onRemove={removeBackgroundImage}
                  isLoading={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="lg:col-span-2"
                  aspectRatio="h-[300px] sm:h-[400px] lg:h-[500px]"
                  inputId="uploadbg"
                />

                <ImageUploadField
                  label="Muqova rasmi"
                  description="Muqova uchun rasm yuklang (tavsiya: 300x450px)"
                  previewUrl={cardPreviewUrl}
                  onFileChange={handleCardFileChange}
                  onRemove={removeCardImage}
                  isLoading={
                    createMutation.isPending || updateMutation.isPending
                  }
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
                          Nomi
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={
                              createMutation.isPending ||
                              updateMutation.isPending
                            }
                            placeholder="Film nomini kiriting..."
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
                          Turi
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            createMutation.isPending || updateMutation.isPending
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Film turini belgilash" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={FilmType.SERIES}>
                              Serial
                            </SelectItem>
                            <SelectItem value={FilmType.MOVIE}>Kino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel className="text-base font-semibold">
                      Janrlar
                    </FormLabel>
                    {!createMutation.isPending && !updateMutation.isPending && (
                      <Dialog
                        open={selectGenreModal.open}
                        onOpenChange={selectGenreModal.setOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 flex items-center justify-between bg-transparent"
                            disabled={
                              createMutation.isPending ||
                              updateMutation.isPending
                            }
                          >
                            <span>
                              {selectedGenres.length > 0
                                ? `${selectedGenres.length} ta janr tanlangan`
                                : "Janrlarni tanlash"}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Janrni tanlash</DialogTitle>
                            <DialogDescription>
                              Filmni tasvirlab bera oladigan janrlarni tanlang
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

                  <div className="space-y-2">
                    <SelectCategory
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <FilmMembersSection
                    selectedActors={selectedActors}
                    setSelectedActors={setSelectedActors}
                    selectedTranslators={selectedTranslators}
                    setSelectedTranslators={setSelectedTranslators}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Tavsif
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={
                              createMutation.isPending ||
                              updateMutation.isPending
                            }
                            placeholder="Film tavsifini kiriting..."
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
                            Nashr etish
                          </FormLabel>
                          <FormDescription>
                            {`Foydalanuvchilarga ko'rinishini xoxlasangiz buni
                            yoqib qo'ying`}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={
                              createMutation.isPending ||
                              updateMutation.isPending
                            }
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
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {initialData ? "Filmni yangilash" : "Filmni yaratish"}
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
