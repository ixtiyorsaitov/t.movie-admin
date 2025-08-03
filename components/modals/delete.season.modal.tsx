"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  DialogStack,
  DialogStackBody,
  DialogStackContent,
  DialogStackDescription,
  DialogStackFooter,
  DialogStackHeader,
  DialogStackNext,
  DialogStackOverlay,
  DialogStackPrevious,
  DialogStackTitle,
  DialogStackTrigger,
} from "@/components/ui/dialog-stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Loader2, Trash } from "lucide-react";
import { BUCKETS, IEpisode, IFilm, ISeason } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useMutation, useQuery } from "@tanstack/react-query";
import { removeVideo } from "@/lib/supabase-utils";
import axios from "axios";
import { toast } from "sonner";

const DeleteSeasonModal = ({
  initialData,
  episodes,
  data,
  setData,
  setInitialData,
}: {
  data: IFilm;
  setData: Dispatch<SetStateAction<IFilm>>;
  setInitialData: Dispatch<SetStateAction<ISeason | null>>;
  initialData: ISeason;
  episodes: IEpisode[];
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (seasonId: string) => {
      const episodeVideoNames = episodes.map((c) => c.video.name);

      if (episodeVideoNames.length > 0) {
        const deletedVideos = await removeVideo(
          episodeVideoNames,
          BUCKETS.SERIES
        );
        if (!deletedVideos.success) {
          return;
        }
      }
      const { data: response } = await axios.delete(
        `/api/film/${data._id}/control/season/${seasonId}`
      );
      console.log(response);
      if (response.success) {
        setData((prev) => {
          return {
            ...prev,
            seasons: prev.seasons.filter((c) => c._id !== initialData._id),
          };
        });
        setInitialData(null);
        toast.success("Success", {
          description: `Season ${initialData.seasonNumber} deleted`,
        });
      } else {
        toast.success("Error", {
          description: response.error,
        });
      }

      return "success";
    },
  });

  const handleSubmit = () => {
    mutate(initialData._id);
  };

  return (
    <>
      <DialogStack dismissable={false} open={open} onOpenChange={setOpen}>
        <DialogStackTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="size-7 dark:hover:bg-destructive hover:bg-destructive"
          >
            <Trash />
          </Button>
        </DialogStackTrigger>
        <DialogStackOverlay />
        <DialogStackBody>
          {/* First Dialog: Initial Confirmation */}
          <DialogStackContent>
            <DialogStackHeader>
              <DialogStackTitle className="text-xl font-semibold">
                Haqiqatdan ham {initialData.seasonNumber}-fasl ni
                o'chirmoqchimisiz?
              </DialogStackTitle>
              <DialogStackDescription className="text-sm text-muted-foreground">
                Bu operatsiyani bajarishdan oldin haqiqatdan ham o'chirmoqchi
                ekanligingizga amin bo'ling!
              </DialogStackDescription>
            </DialogStackHeader>
            <DialogStackFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Bekor qilish
              </Button>
              <DialogStackNext asChild>
                <Button variant="outline">Keyingi</Button>
              </DialogStackNext>
            </DialogStackFooter>
          </DialogStackContent>

          {/* Second Dialog: Warning about episodes and videos */}
          <DialogStackContent>
            <DialogStackHeader>
              {/* Replace the existing title and description with Alert component */}
              <Alert
                variant="destructive"
                className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
              >
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle className="text-lg font-semibold">
                  O'chirishni tasdiqlang
                </AlertTitle>
                <AlertDescription className="text-sm">
                  Diqqat! Bu faslni o'chirish bilan birga, uning ichidagi barcha{" "}
                  <span className="font-bold">
                    {initialData.episodes.length} ta epizod
                  </span>{" "}
                  va ularga tegishli videolar ham butunlay o'chib ketadi. Bu
                  qaytarib bo'lmaydigan amal!
                </AlertDescription>
              </Alert>
            </DialogStackHeader>
            <DialogStackFooter className="justify-between gap-2">
              <DialogStackPrevious asChild>
                <Button variant="outline">Oldingi</Button>
              </DialogStackPrevious>
              <DialogStackNext asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    inputRef.current?.focus();
                  }}
                >
                  Keyingi
                </Button>
              </DialogStackNext>
            </DialogStackFooter>
          </DialogStackContent>

          {/* Third Dialog: Final confirmation with input */}
          <DialogStackContent>
            <DialogStackHeader>
              <DialogStackTitle className="text-xl font-semibold">
                Yakuniy tasdiqlash
              </DialogStackTitle>
              <DialogStackDescription className="text-sm text-muted-foreground">
                O'chirishni tasdiqlash uchun quyidagi maydonga "DELETE" so'zini
                kiriting.
              </DialogStackDescription>
            </DialogStackHeader>
            <div className="p-4">
              <Input
                disabled={isPending}
                ref={inputRef}
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && confirmText === "DELETE") {
                    handleSubmit();
                  }
                }}
                className="w-full"
              />
            </div>
            <DialogStackFooter className="justify-between gap-2">
              <DialogStackPrevious disabled={isPending} asChild>
                <Button variant="outline">Oldingi</Button>
              </DialogStackPrevious>
              <Button
                onClick={handleSubmit}
                variant="destructive"
                disabled={confirmText !== "DELETE" || isPending}
              >
                {isPending ? <Loader2 className="animate-spin" /> : <Trash />}
                O'chirish
              </Button>
            </DialogStackFooter>
          </DialogStackContent>
        </DialogStackBody>
      </DialogStack>
    </>
  );
};

export default DeleteSeasonModal;
