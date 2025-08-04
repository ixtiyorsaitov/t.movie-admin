import GenreModal, { GenreDeleteModal } from "@/components/modals/genre.modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDeleteGenre } from "@/hooks/use-delete-modal";
import { cn } from "@/lib/utils";
import { IGenre } from "@/types";
import { Film, MoreVertical, Settings, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  datas: IGenre[];
  modalOpen: boolean;
  initialGenre: IGenre | null;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setInitialGenre: Dispatch<SetStateAction<IGenre | null>>;
}

const GenresPageMain = ({
  datas,
  modalOpen,
  initialGenre,
  setModalOpen,
  setInitialGenre,
}: Props) => {
  const [currentDatas, setCurrentDatas] = useState<IGenre[]>(datas);
  const deleteModal = useDeleteGenre();
  return (
    <>
      <div className="flex items-center justify-center flex-col w-full space-y-1">
        {currentDatas.map((data, index) => (
          <div
            key={data._id}
            className={cn(
              "w-full px-3 py-2 flex items-center justify-between border-b",
              index === 0 && "border-t"
            )}
          >
            <div className="flex items-center justify-start gap-2">
              <Button
                size={"icon"}
                variant={"secondary"}
                className="size-7 rounded-full"
              >
                {index}
              </Button>
              <p>{data.name}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={"icon"}
                  className="size-7 rounded-full"
                  variant={"ghost"}
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setInitialGenre(data);
                    setModalOpen(true);
                  }}
                >
                  <Settings />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Film />
                  Films
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    deleteModal.setData(data);
                    deleteModal.setOpen(true);
                  }}
                  variant="destructive"
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <GenreModal
        datas={currentDatas}
        setDatas={setCurrentDatas}
        open={modalOpen}
        setOpen={setModalOpen}
        initialData={initialGenre}
      />
      <GenreDeleteModal setList={setCurrentDatas} />
    </>
  );
};

export default GenresPageMain;

export const GenresPageMainLoading = () => {
  return (
    <div className="w-full flex items-center justify-center">Loading....</div>
  );
};
