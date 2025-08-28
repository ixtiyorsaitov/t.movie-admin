"use client";

import { IFilm } from "@/types/film";
import {
  AlarmClock,
  Edit,
  MoreVertical,
  PlayIcon,
  Plus,
  Search,
  Trash2,
  Tv,
} from "lucide-react";
import { useCallback, useState } from "react";
import VideoPlayModal from "@/components/modals/video-play.modal";
import { useDeleteEpisode, useEpisodeModal } from "@/hooks/use-modals";
import {
  DeleteEpisodeModal,
  EpisodeModal,
} from "@/components/modals/episode.modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { IEpisode, PaginationType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { debounce } from "lodash";
import { toast } from "sonner";
import { getSearchedEpisodes } from "@/lib/api/episode";
import { getPageNumbers } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { usePlayModal } from "@/hooks/use-play-modal";

interface Props {
  film: IFilm;
  datas: IEpisode[];
  pagination: PaginationType;
  limit: number;
}

const SeriesControl = ({
  datas: defaultDatas,
  film,
  pagination: defaultPagination,
  limit,
}: Props) => {
  const [datas, setDatas] = useState<IEpisode[]>(defaultDatas);
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);
  const [searchTerm, setSearchTerm] = useState("");
  const episodeModal = useEpisodeModal();
  const deleteModal = useDeleteEpisode();
  const playModal = usePlayModal();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setDatas(defaultDatas);
      setPagination(defaultPagination);
      return;
    }
    const newData = await getSearchedEpisodes({
      searchTerm: e.target.value,
      page: pagination.page,
      limit,
      filmId: film._id,
    });
    if (newData.error) {
      toast.error(newData.error);
    }
    setDatas(newData.datas);
    setPagination(newData.pagination);
  };

  const handlePageChange = async (page: number) => {
    const newData = await getSearchedEpisodes({
      searchTerm,
      page,
      limit,
      filmId: film._id,
    });
    if (newData.error) {
      toast.error(newData.error);
      return;
    }
    setDatas(newData.datas);
    setPagination(newData.pagination);
  };

  const handleDebouncedSearch = useCallback(debounce(handleSearch, 300), []);

  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2 space-y-3">
        <div className="w-full flex items-center justify-between">
          <Heading
            title="Epizodlar"
            description={`${film.title} filmining epizodlarini boshqarish`}
          />
          <Button
            onClick={() => {
              episodeModal.setOpen(true);
              episodeModal.setData(null);
            }}
          >
            <Plus />
            {"Qo'shish"}
          </Button>
        </div>
        <Separator className="my-3" />
        <div className="flex items-center space-x-2 mb-3 w-full justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Epizodlar ichida qidirish..."
              onChange={handleDebouncedSearch}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="">
            Jami: {defaultPagination.total}
          </Button>
        </div>
        <div className="w-full rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 text-center font-semibold">
                  №
                </TableHead>
                <TableHead className="font-semibold">Nomi</TableHead>
                <TableHead className="font-semibold">
                  <AlarmClock />
                </TableHead>
                <TableHead className="font-semibold">Hajmi</TableHead>
                <TableHead className="font-semibold">
                  {"Qo'shilgan sana"}
                </TableHead>
                <TableHead className="w-24 text-center font-semibold">
                  Amallar
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Hech qanday janr topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                datas.map((data) => (
                  <TableRow
                    key={data._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-center">
                      {data.episodeNumber}.
                    </TableCell>
                    <TableCell className="font-medium">{data.title}</TableCell>
                    <TableCell className="font-medium">
                      {data.video.duration}
                    </TableCell>
                    <TableCell className="font-medium">
                      {data.video.size}
                    </TableCell>
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
                              playModal.setVideoUrl(data.video.url);
                              playModal.setOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <PlayIcon className="mr-2 h-4 w-4" />
                            {"Ko'rish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              episodeModal.setData(data);
                              episodeModal.setOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => {
                              deleteModal.setData(data);
                              deleteModal.setOpen(true);
                            }}
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
        {pagination.total > limit && (
          <Pagination className="mt-4 justify-end">
            <PaginationContent>
              {/* Prev tugmasi */}
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() =>
                    pagination.page > 1 && handlePageChange(pagination.page - 1)
                  }
                />
              </PaginationItem>

              {/* Sahifa tugmalari */}
              {getPageNumbers(pagination).map((page, i) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <span className="px-2">...</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem
                    key={`page-${page}`}
                    className="cursor-pointer"
                  >
                    <PaginationLink
                      isActive={page === pagination.page}
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Next tugmasi */}
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() =>
                    pagination.page < pagination.totalPages &&
                    handlePageChange(pagination.page + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <EpisodeModal setDatas={setDatas} filmId={film._id} />
      <DeleteEpisodeModal setEpisodes={setDatas} filmId={film._id} />
      <VideoPlayModal />
    </>
  );
};

export default SeriesControl;
