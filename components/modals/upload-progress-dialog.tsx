import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface UploadProgressDialogProps {
  isOpen: boolean;
  progress: number;
  fileName: string | null;
}

export const UploadProgressDialog = ({
  isOpen,
  progress,
  fileName,
}: UploadProgressDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading Video...
          </AlertDialogTitle>
          <AlertDialogDescription>
            {fileName
              ? `Uploading "${fileName}"`
              : "Please wait while your video is being uploaded."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            {Math.round(progress)}%
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
