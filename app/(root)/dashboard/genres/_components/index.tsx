"use client";

import GenreModal, {
  GenreDeleteModal,
  GenreFilmsModal,
} from "@/components/modals/genre.modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteGenre,
  useGenreFilmsModal,
  useGenreModal,
} from "@/hooks/use-modals";
import type { IGenre } from "@/types";
import { format } from "date-fns";
import { Edit, Film, MoreVertical, PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  datas: IGenre[];
}

const GenresPageMain = ({ datas }: Props) => {
  const [currentDatas, setCurrentDatas] = useState<IGenre[]>(datas);
  const genreModal = useGenreModal();
  const deleteModal = useDeleteGenre();
  const genreFilmModal = useGenreFilmsModal();

  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-start justify-between w-full mb-3">
          <Heading
            title="Janrlar"
            description="Jarnlarni boshqarish (Server jadval funksiyalari orqali)"
          />
          <Button
            onClick={() => {
              genreModal.setData(null);
              genreModal.setOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
          </Button>
        </div>
        <div className="w-full rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 text-center font-semibold">
                  №
                </TableHead>
                <TableHead className="font-semibold">Janr nomi</TableHead>
                <TableHead className="font-semibold">
                  {"Qo'shilgan sana"}
                </TableHead>
                <TableHead className="w-24 text-center font-semibold">
                  Amallar
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDatas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Hech qanday janr topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                currentDatas.map((data, index) => (
                  <TableRow
                    key={data._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-center">
                      {index + 1}.
                      {/* <div className="flex items-center justify-center">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      </div>
                    </div> */}
                    </TableCell>
                    <TableCell className="font-medium">{data.name}</TableCell>
                    <TableCell className="font-medium">
                      {format(new Date(data.createdAt), "dd.MM.yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Amallar menyusi</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              genreModal.setData(data);
                              genreModal.setOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              genreFilmModal.setData(data);
                              genreFilmModal.setOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Film className="mr-2 h-4 w-4" />
                            Filmlar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              deleteModal.setData(data);
                              deleteModal.setOpen(true);
                            }}
                            variant="destructive"
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {"O'chirish"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <GenreModal setDatas={setCurrentDatas} />
      <GenreDeleteModal setList={setCurrentDatas} />
      {genreFilmModal.data && <GenreFilmsModal />}
    </>
  );
};

export default GenresPageMain;

export const GenresPageMainLoading = () => {
  return (
    <div className="w-full rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 text-center font-semibold">№</TableHead>
            <TableHead className="font-semibold">Janr nomi</TableHead>
            <TableHead className="font-semibold">{"Qo'shilgan sana"}</TableHead>
            <TableHead className="w-24 text-center font-semibold">
              Amallar
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow
              key={index}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div className="size-8 rounded-full bg-muted animate-pulse"></div>
                </div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
