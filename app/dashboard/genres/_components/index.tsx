import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { IGenre } from "@/types";
import {
  Film,
  MoreHorizontal,
  MoreVertical,
  Settings,
  Trash2,
} from "lucide-react";
import React from "react";

const GenresPageMain = ({ datas }: { datas: IGenre[] }) => {
  return (
    <div className="flex items-center justify-center flex-col w-full space-y-1">
      {datas.map((data, index) => (
        <div
          key={data._id}
          className="w-full px-3 py-1 flex items-center justify-between border-y"
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
              <DropdownMenuItem>
                <Settings />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Film />
                Films
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default GenresPageMain;

export const GenresPageMainLoading = () => {
  return (
    <div className="w-full flex items-center justify-center">Loading....</div>
  );
};
