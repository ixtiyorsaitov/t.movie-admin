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
import { useDeleteNews } from "@/hooks/use-modals";

const DeleteNewsModal = ({
  onDelete,
  loading,
}: {
  onDelete: () => void;
  loading: boolean;
}) => {
  const { open, setOpen, data, setData } = useDeleteNews();
  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Sliderni olib tashlash"}</AlertDialogTitle>
            <AlertDialogDescription>
              Siz haqiqatdan ham
              <span className="font-bold text-white">{` ${data.title} `}</span>
              yangilikini {"o'chirib"} tashlamoqchimisiz?
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
              Bekor qilish
            </AlertDialogCancel>
            <Button
              disabled={loading}
              variant={"destructive"}
              onClick={onDelete}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
              {"O'chirish"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default DeleteNewsModal;
