"use client";
import type React from "react";
import { filmFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BUCKETS, FilmType, type IFilm } from "@/types";
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
import {
  ChevronDown,
  Loader,
  UploadIcon,
  X,
  Check,
  Upload,
  Database,
  FileImage,
} from "lucide-react";
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

interface Props {
  initialData: IFilm | null;
  pageTitle: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Step-by-step loading modal component
const CreationLoadingModal = ({
  isOpen,
  currentStep,
}: {
  isOpen: boolean;
  currentStep: 1 | 2 | 3 | "final" | null;
}) => {
  const steps = [
    {
      step: 1,
      title: "Creating Film Record",
      description: "Setting up your film in the database...",
      icon: Database,
    },
    {
      step: 2,
      title: "Uploading Background Image",
      description: "Processing and uploading background image...",
      icon: Upload,
    },
    {
      step: 3,
      title: "Uploading Card Image",
      description: "Processing and uploading poster image...",
      icon: FileImage,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative bg-background border rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Creating Your Film</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we process your film...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((stepInfo) => {
            const isActive = currentStep === stepInfo.step;
            const isCompleted =
              typeof currentStep === "number" && currentStep > stepInfo.step;
            const Icon = stepInfo.icon;

            return (
              <div
                key={stepInfo.step}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all duration-300",
                  isActive && "bg-primary/10 border border-primary/20",
                  isCompleted && "bg-green-50 dark:bg-green-950/20"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-green-500 text-white",
                    !isActive &&
                      !isCompleted &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isActive ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium text-sm transition-colors duration-300",
                      isActive && "text-primary",
                      isCompleted && "text-green-600 dark:text-green-400"
                    )}
                  >
                    {stepInfo.title}
                  </p>
                  <p
                    className={cn(
                      "text-xs transition-colors duration-300",
                      isActive && "text-primary/70",
                      isCompleted && "text-green-600/70 dark:text-green-400/70",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {stepInfo.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Final step */}
          {currentStep === "final" && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-green-600 dark:text-green-400">
                  Film Created Successfully!
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  Your film has been created and is ready to use.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>
              {currentStep === "final"
                ? "100%"
                : typeof currentStep === "number"
                ? `${Math.round((currentStep / 3) * 100)}%`
                : "0%"}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  currentStep === "final"
                    ? "100%"
                    : typeof currentStep === "number"
                    ? `${(currentStep / 3) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Update step-by-step loading modal component
const UpdateLoadingModal = ({
  isOpen,
  currentStep,
}: {
  isOpen: boolean;
  currentStep: 1 | 2 | 3 | "final" | null;
}) => {
  const steps = [
    {
      step: 1,
      title: "Preparing Update",
      description: "Processing your changes...",
      icon: Database,
    },
    {
      step: 2,
      title: "Updating Images",
      description: "Uploading new images if changed...",
      icon: Upload,
    },
    {
      step: 3,
      title: "Saving Changes",
      description: "Finalizing your film updates...",
      icon: FileImage,
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative bg-sidebar border rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Updating Your Film</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we save your changes...
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((stepInfo) => {
            const isActive = currentStep === stepInfo.step;
            const isCompleted =
              typeof currentStep === "number" && currentStep > stepInfo.step;
            const Icon = stepInfo.icon;

            return (
              <div
                key={stepInfo.step}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-all duration-300",
                  isActive &&
                    "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800",
                  isCompleted && "bg-green-50 dark:bg-green-950/20"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                    isActive && "bg-blue-500 text-white",
                    isCompleted && "bg-green-500 text-white",
                    !isActive &&
                      !isCompleted &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isActive ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium text-sm transition-colors duration-300",
                      isActive && "text-blue-600 dark:text-blue-400",
                      isCompleted && "text-green-600 dark:text-green-400"
                    )}
                  >
                    {stepInfo.title}
                  </p>
                  <p
                    className={cn(
                      "text-xs transition-colors duration-300",
                      isActive && "text-blue-600/70 dark:text-blue-400/70",
                      isCompleted && "text-green-600/70 dark:text-green-400/70",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {stepInfo.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Final step */}
          {currentStep === "final" && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                <Check className="w-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-green-600 dark:text-green-400">
                  Film Updated Successfully!
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  Your changes have been saved successfully.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>
              {currentStep === "final"
                ? "100%"
                : typeof currentStep === "number"
                ? `${Math.round((currentStep / 3) * 100)}%`
                : "0%"}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  currentStep === "final"
                    ? "100%"
                    : typeof currentStep === "number"
                    ? `${(currentStep / 3) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialDataState ? initialDataState.genres.map((genre) => genre._id) : []
  );

  useEffect(() => {
    console.log("selectedGenres", selectedGenres);
    console.log(initialData);
  }, [selectedGenres]);

  async function handleUpload(file: File, bucketName: BUCKETS) {
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

  async function handleRemoveImage(fileName: string[], bucketName: BUCKETS) {
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
      setUpdatingStep(1);

      const backgroundImage = {
        url: initialDataState?.images.backgroundImage.url,
        name: initialDataState?.images.backgroundImage.name,
      } as {
        url: string | null;
        name: string | null;
      };
      const cardImage = {
        url: initialDataState?.images.image.url,
        name: initialDataState?.images.image.name,
      } as {
        url: string | null;
        name: string | null;
      };

      setUpdatingStep(2);

      if (initialDataState && backgroundFile !== null) {
        await handleRemoveImage(
          [initialDataState.images.backgroundImage.name],
          BUCKETS.BACKGROUNDS
        );
        const uploadedBg = (await handleUpload(
          backgroundFile,
          BUCKETS.BACKGROUNDS
        )) as {
          fileName: string;
          url: string;
          success: boolean;
        };
        if (uploadedBg.success) {
          backgroundImage.url = uploadedBg.url;
          backgroundImage.name = uploadedBg.fileName;
        } else {
          setUpdatingStep(null);
          return toast.error("Error with upload background image");
        }
      }

      if (initialDataState && cardFile !== null) {
        await handleRemoveImage(
          [initialDataState.images.image.name],
          BUCKETS.IMAGES
        );
        const uploadedImg = (await handleUpload(cardFile, BUCKETS.IMAGES)) as {
          fileName: string;
          url: string;
          success: boolean;
        };
        if (uploadedImg.success) {
          cardImage.url = uploadedImg.url;
          cardImage.name = uploadedImg.fileName;
        } else {
          setUpdatingStep(null);
          return toast.error("Error with upload image");
        }
      }

      setUpdatingStep(3);

      const formData = {
        ...initialDataState,
        ...values,
        genres: selectedGenres,
        images: {
          ...initialDataState?.images,
          backgroundImage,
          image: cardImage,
        },
      };
      console.log(formData);
      const { data } = await axios.put(
        `/api/film/${initialDataState?._id}`,
        formData
      );
      console.log(data);
      if (data.success) {
        setUpdatingStep("final");
        toast.success("Film updated successfully!");
        setInitialDataState(data.film);
        setBackgroundFile(null);
        setCardFile(null);

        // Hide modal after 2 seconds
        setTimeout(() => {
          setUpdatingStep(null);
        }, 2000);
      } else {
        setUpdatingStep(null);
        toast.error(data.error);
      }
      return "data";
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
      const uploadBg = (await handleUpload(
        backgroundFile!,
        BUCKETS.BACKGROUNDS
      )) as {
        url: string;
        fileName: string;
        success: boolean;
      };
      if (!uploadBg.success) {
        setCreatingStep(null);
        return toast.error("Something went wrong with upload background image");
      }

      const uploadImg = (await handleUpload(cardFile!, BUCKETS.IMAGES)) as {
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
      console.log(finallyFormData);
      const { data: finallyData } = await axios.put(
        "/api/film",
        finallyFormData
      );
      if (finallyData.success) {
        setCreatingStep("final");
        toast.success("Film created successfully!");

        // Hide modal after 2 seconds
        setTimeout(() => {
          setCreatingStep(null);
          form.reset();
          setSelectedGenres([]);
          setBackgroundFile(null);
          setBackgroundPreviewUrl(null);
          setCardFile(null);
          setCardPreviewUrl(null);
        }, 2000);
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

  const removeBackgroundImage = () => {
    setBackgroundFile(null);
    setBackgroundPreviewUrl(null);
  };

  const removeCardImage = () => {
    setCardFile(null);
    setCardPreviewUrl(null);
  };

  useEffect(() => {
    console.log(creatingStep);
  }, [creatingStep]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {/* Step-by-step loading modal */}
      <CreationLoadingModal
        isOpen={creatingStep !== null}
        currentStep={creatingStep}
      />

      {/* Update step-by-step loading modal */}
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
              {/* IMAGES SECTION - Side by side layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* BACKGROUND IMAGE */}
                <div className="lg:col-span-2">
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Background Image
                    </FormLabel>
                    <FormDescription className="mb-3">
                      Upload a high-quality background image for the film
                      (recommended: 1920x1080px)
                    </FormDescription>
                    <div className="group w-full h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center rounded-lg cursor-pointer relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                      {backgroundPreviewUrl && (
                        <>
                          <Image
                            src={backgroundPreviewUrl || "/placeholder.svg"}
                            alt="Background Preview"
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                          />
                          {!isLoading && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 z-20"
                              onClick={removeBackgroundImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                      {backgroundPreviewUrl && !isLoading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <FormLabel
                            htmlFor="uploadbg"
                            className="flex items-center justify-center flex-col space-y-2 border bg-background/90 text-foreground rounded-lg px-6 py-4 cursor-pointer hover:bg-background transition-colors"
                          >
                            <UploadIcon className="w-6 h-6" />
                            <span className="text-sm font-medium">
                              Change Image
                            </span>
                          </FormLabel>
                        </div>
                      )}
                      <FormLabel
                        htmlFor="uploadbg"
                        className={cn(
                          "w-full h-full items-center justify-center cursor-pointer",
                          backgroundPreviewUrl ? "hidden" : "flex",
                          isLoading && "pointer-events-none opacity-50"
                        )}
                      >
                        {!backgroundPreviewUrl && (
                          <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className="rounded-full border-2 border-dashed border-muted-foreground/50 p-4">
                              <UploadIcon className="text-muted-foreground w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium">
                                Upload Background Image
                              </p>
                              <p className="text-sm text-muted-foreground/70 mt-1">
                                Click to browse or drag and drop
                              </p>
                            </div>
                          </div>
                        )}
                        <Input
                          id="uploadbg"
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundFileChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </FormLabel>
                    </div>
                  </FormItem>
                </div>
                {/* CARD IMAGE */}
                <div className="lg:col-span-1">
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Card Image
                    </FormLabel>
                    <FormDescription className="mb-3">
                      Upload the main poster image (recommended: 300x450px)
                    </FormDescription>
                    <div className="group w-full aspect-[2/3] max-w-[300px] mx-auto lg:mx-0 flex items-center justify-center rounded-lg cursor-pointer relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                      {cardPreviewUrl && (
                        <>
                          <Image
                            src={cardPreviewUrl || "/placeholder.svg"}
                            alt="Card Preview"
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                          {!isLoading && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 z-20"
                              onClick={removeCardImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                      {cardPreviewUrl && !isLoading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <FormLabel
                            htmlFor="uploadcard"
                            className="flex items-center justify-center flex-col space-y-2 border bg-background/90 text-foreground rounded-lg px-4 py-3 cursor-pointer hover:bg-background transition-colors"
                          >
                            <UploadIcon className="w-5 h-5" />
                            <span className="text-xs font-medium">Change</span>
                          </FormLabel>
                        </div>
                      )}
                      <FormLabel
                        htmlFor="uploadcard"
                        className={cn(
                          "w-full h-full items-center justify-center cursor-pointer",
                          cardPreviewUrl ? "hidden" : "flex",
                          isLoading && "pointer-events-none opacity-50"
                        )}
                      >
                        {!cardPreviewUrl && (
                          <div className="flex flex-col items-center justify-center gap-3 text-center px-4">
                            <div className="rounded-full border-2 border-dashed border-muted-foreground/50 p-3">
                              <UploadIcon className="text-muted-foreground w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-muted-foreground font-medium text-sm">
                                Upload Poster
                              </p>
                              <p className="text-xs text-muted-foreground/70 mt-1">
                                Click or drag
                              </p>
                            </div>
                          </div>
                        )}
                        <Input
                          id="uploadcard"
                          type="file"
                          accept="image/*"
                          onChange={handleCardFileChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </FormLabel>
                    </div>
                  </FormItem>
                </div>
              </div>

              {/* FORM FIELDS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                  {/* TITLE */}
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
                  {/* FILM TYPE */}
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
                  {/* GENRES */}
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
                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  {/* DESCRIPTION */}
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
                  {/* PUBLISHED */}
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

              {/* SUBMIT BUTTON */}
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
