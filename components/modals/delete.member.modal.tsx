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
import { useDeleteMemberModal } from "@/hooks/use-modals";
import { toast } from "sonner";
import { IMember } from "@/types/member";
import { useDeleteMemberMutation } from "@/hooks/useMembers";

const DeleteMemberModal = ({
  setDatas,
}: {
  setDatas: React.Dispatch<React.SetStateAction<IMember[]>>;
}) => {
  const { open, setOpen, data, setData } = useDeleteMemberModal();

  const deleteMutation = useDeleteMemberMutation();

  const onDeleteMember = async () => {
    deleteMutation.mutate(data?._id as string, {
      onSuccess: (res) => {
        console.log(res);

        if (res.success) {
          toast.success(res.message);
          setDatas((prev) => prev.filter((c) => c._id !== data?._id));
          setData(null);
          setOpen(false);
        } else {
          toast.error(res.error);
        }
      },
    });
  };

  const loading = deleteMutation.isPending;
  return (
    data && (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Sliderni olib tashlash"}</AlertDialogTitle>
            <AlertDialogDescription>
              Siz haqiqatdan ham
              <span className="font-bold text-white">{` ${data.user.name} `}</span>
              dan hodimlik huquqini olib tashlamoqchimisiz?
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
              onClick={onDeleteMember}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Davom etish
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default DeleteMemberModal;
