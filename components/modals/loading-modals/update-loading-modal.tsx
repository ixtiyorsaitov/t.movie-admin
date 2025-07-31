import { Check, Loader, Database, Upload, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoadingModalProps, StepInfo } from "@/types/film-form.types";

const steps: StepInfo[] = [
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

export const UpdateLoadingModal = ({
  isOpen,
  currentStep,
}: LoadingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative bg-background border rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
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

          {currentStep === "final" && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                <Check className="w-4 h-4" />
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
