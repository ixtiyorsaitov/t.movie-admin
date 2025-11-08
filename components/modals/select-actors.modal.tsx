import { useActorsSelectModal } from "@/hooks/use-modals";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface ActorSelectModalProps {
  initialData: string[];
  onActorChange: (actors: string[]) => void;
  loading: boolean;
  error: string | undefined;
}

const SelectActorsModal = ({
  initialData,
  onActorChange,
  loading,
  error,
}: ActorSelectModalProps) => {
  const modal = useActorsSelectModal();

  const handleActorToggle = (actorId: string) => {
    setSelectedActors((prev) =>
      prev.includes(actorId)
        ? prev.filter((id) => id !== actorId)
        : [...prev, actorId]
    );
  };

  const [selectedActorsLocal, setSelectedActors] =
    useState<string[]>(initialData);

  const handleConfirm = () => {
    modal.setOpen(false);
    onActorChange(selectedActorsLocal);
  };

  return (
    <Dialog open={modal.open} onOpenChange={modal.setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ovoz aktyorlarini tanlang</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Yuklanayapti...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              Xato: {error}
            </p>
          </div>
        )}

        {!loading && (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
            {modal.data.length === 0 ? (
              <p className="text-sm text-gray-500">Ovoz aktyorlar topilmadi</p>
            ) : (
              modal.data.map((actor) => (
                <div key={actor._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={actor._id}
                    checked={selectedActorsLocal.includes(actor._id)}
                    onCheckedChange={() => handleActorToggle(actor._id)}
                  />
                  <label
                    htmlFor={actor._id}
                    className="text-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Avatar className="border border-primary">
                      <AvatarImage src={actor.user.avatar || ""} />
                      <AvatarFallback>
                        {actor.user.name.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {actor.user.name}
                  </label>
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedActors(initialData);
              modal.setOpen(false);
            }}
            className="flex-1"
          >
            Bekor qilish
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            Saqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectActorsModal;
