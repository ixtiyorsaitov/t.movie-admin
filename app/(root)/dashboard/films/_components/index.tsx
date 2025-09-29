"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSearchedFilms } from "@/lib/api/films";
import { cn, getPageNumbers } from "@/lib/utils";
import { FilmType, PaginationType } from "@/types";
import { IFilm } from "@/types/film";
import { format } from "date-fns";
import { debounce } from "lodash";
import {
  Copy,
  Edit,
  EyeIcon,
  MoreVertical,
  PlusIcon,
  Search,
  StarIcon,
  ThumbsUp,
  Trash2,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const FilmsPageMain = ({
  datas,
  limit,
  pagination: defaultPagination,
}: {
  datas: IFilm[];
  limit: number;
  pagination: PaginationType;
}) => {
  const [currentDatas, setCurrentDatas] = useState<IFilm[]>(datas);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setCurrentDatas(datas);
      setPagination(defaultPagination);
      return;
    }
    const newData = await getSearchedFilms({
      searchTerm: e.target.value,
      page: pagination.page,
      limit,
    });
    if (newData.error) {
      toast.error(newData.error);
    }
    setCurrentDatas(newData.datas);
    setPagination(newData.pagination);
  };

  const handlePageChange = async (page: number) => {
    const newData = await getSearchedFilms({ searchTerm, page, limit });
    if (newData.error) {
      toast.error(newData.error);
      return;
    }
    setCurrentDatas(newData.datas);
    setPagination(newData.pagination);
  };

  const handleDebouncedSearch = useCallback(debounce(handleSearch, 300), []);

  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <div className="flex items-start justify-between w-full">
        <Heading
          title="Filmlar"
          description="Filmlarni boshqarish (Server jadval funksiyalari orqali)"
        />
        <Link
          href="/dashboard/films/create"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
        </Link>
      </div>
      <Separator className="my-3" />
      <div className="flex items-center space-x-2 mb-3 w-full justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Filmlar ichida qidirish..."
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
              <TableHead className="font-semibold">Nomi</TableHead>
              <TableHead className="font-semibold">Turi</TableHead>
              <TableHead className="font-semibold">Reyting</TableHead>
              <TableHead className="font-semibold">Kategoriya</TableHead>
              <TableHead className="font-semibold">Janrlar</TableHead>
              <TableHead className="font-semibold">Yaratilgan sana</TableHead>
              <TableHead className="font-semibold">Nashr</TableHead>
              <TableHead className="w-24 text-center font-semibold" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDatas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-[200px]">
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                    <Search className="h-10 w-10 opacity-50" />
                    <p className="text-sm md:text-base font-medium">
                      Hech qanday film topilmadi
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentDatas.map((data) => (
                <TableRow
                  key={data._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium ">
                    <p className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {data.title}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.type === FilmType.SERIES ? "Serial" : "Kino"}
                  </TableCell>
                  <TableCell className="font-medium flex items-center justify-start gap-3 relative top-1.5">
                    <div className="flex items-center gap-1">
                      {data.meta.views?.total || 0}
                      <EyeIcon size={20} />
                    </div>
                    <div className="flex items-center gap-1">
                      {data.rating.average}/10
                      <StarIcon className="fill-primary" size={20} />
                    </div>
                    <div className="flex items-center gap-1">
                      {data.meta.likes}
                      <ThumbsUp size={17} />
                    </div>
                  </TableCell>

                  <TableCell>Ongoing</TableCell>
                  <TableCell className="space-x-2">
                    {data.genres.length === 0 ? (
                      <div>Janrlar {"yo'q"}</div>
                    ) : (
                      data.genres
                        .slice(0, 2)
                        .map((genre) => (
                          <Badge key={genre._id}>{genre.name}</Badge>
                        ))
                    )}
                    {data.genres.length > 2 && (
                      <Badge variant={"secondary"}>
                        +{data.genres.length - 2}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(data.createdAt), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell className="font-medium ">
                    {data.published ? (
                      <Badge>Xa</Badge>
                    ) : (
                      <Badge variant="destructive">{"Yo'q"}</Badge>
                    )}
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
                            navigator.clipboard.writeText(data._id);
                            toast.success("ID nusxalandi");
                          }}
                          className="cursor-pointer"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          ID ni nusxalash
                        </DropdownMenuItem>
                        <Link href={`/dashboard/films/${data._id}/control`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Tv className="mr-2 h-4 w-4" />
                            {data.type === FilmType.SERIES
                              ? "Seriyalar"
                              : "Kino"}
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/films/${data._id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
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
                <PaginationItem key={`page-${page}`} className="cursor-pointer">
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
  );
};

export default FilmsPageMain;
