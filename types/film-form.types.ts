import type { IFilm, FilmType } from "@/types";

export interface FilmFormProps {
  initialData: IFilm | null;
  pageTitle: string;
}

export type LoadingStep = 1 | 2 | 3 | "final" | null;

export interface LoadingModalProps {
  isOpen: boolean;
  currentStep: LoadingStep;
}

export interface StepInfo {
  step: number;
  title: string;
  description: string;
  icon: any;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
}

export interface FormData {
  title: string;
  description: string;
  type: FilmType;
  published: boolean;
}
