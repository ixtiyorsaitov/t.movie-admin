import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useDeleteSlider } from "@/hooks/use-slider-modal";

const DeleteSliderModal = ({
  onDelete,
  loading,
}: {
  onDelete: () => void;
  loading: boolean;
}) => {
  const { open, setOpen, data, setData } = useDeleteSlider();
  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Sliderni olib tashlash"}</AlertDialogTitle>
            <AlertDialogDescription>
              Siz haqiqatdan ham sliderdan
              <span className="font-bold text-white">{` ${data.film.title} `}</span>
              animesini olib tashlamoqchimisiz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => {
                setData(null);
                setOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={loading}
              variant={"destructive"}
              onClick={onDelete}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default DeleteSliderModal;
