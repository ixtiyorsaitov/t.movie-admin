"use client";

import DeleteNewsModal from "@/components/modals/delete.news.modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteNews } from "@/hooks/use-modals";
import api from "@/lib/axios";
import { removeImage } from "@/lib/supabase-utils";
import { BUCKETS, INews, PaginationType } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Edit, MoreVertical, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "@/lib/utils";
import { format } from "date-fns";

const getSearchedData = async (
  searchTerm: string,
  page: number,
  limit: number
) => {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/news?search=${searchTerm}&page=${page}&limit=${limit}`
  );
  const data = await res.json();

  return data;
};

const NewsPage = ({
  datas,
  limit,
  pagination: defaultPagination,
}: {
  limit: number;
  datas: INews[];
  pagination: PaginationType;
}) => {
  const deleteModal = useDeleteNews();
  const [currentDatas, setCurrentDatas] = useState<INews[]>(datas);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (deleteModal.data?.image) {
        await removeImage([deleteModal.data.image.name], BUCKETS.NEWS);
      }
      const { data: res } = await api.delete(`/news/${deleteModal.data?._id}`);
      return res;
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Maqola muvaffaqiyatli o'chirildi");
        setCurrentDatas((prev) =>
          prev.filter((item) => item._id !== res.data._id)
        );
        deleteModal.setData(null);
        deleteModal.setOpen(false);
      }
    },
  });
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setCurrentDatas(datas);
      setPagination(defaultPagination);
      return;
    }
    const newData = await getSearchedData(
      e.target.value,
      pagination.page,
      limit
    );
    if (newData.error) {
      toast.error(newData.error);
    }
    setCurrentDatas(newData.datas);
    setPagination(newData.pagination);
  };
  const handlePageChange = async (page: number) => {
    const newData = await getSearchedData(searchTerm, page, limit);
    if (newData.error) {
      toast.error(newData.error);
      return;
    }
    setCurrentDatas(newData.datas);
    setPagination(newData.pagination);
  };
  const handleDebouncedSearch = useCallback(debounce(handleSearch, 300), []);
  return (
    <>
      <div className="flex items-center space-x-2 mb-3 w-full justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Yangiliklar ichida qidirish..."
            onChange={handleDebouncedSearch}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="">
          Jami: {defaultPagination.total}
        </Button>
      </div>
      <div className="w-full rounded-lg border bg-card min-h-[200px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold w-[50px]">Rasm</TableHead>
              <TableHead className="font-semibold">Sarvlaha</TableHead>
              <TableHead className="font-semibold">Tavsif</TableHead>
              <TableHead className="font-semibold">Yaratilgan sana</TableHead>
              <TableHead className="font-semibold">Nashr</TableHead>
              <TableHead className="w-24 text-center font-semibold" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDatas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Hech qanday maqola topilmadi
                </TableCell>
              </TableRow>
            ) : (
              currentDatas.map((data) => (
                <TableRow
                  key={data._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    <div className="w-15 h-7 relative">
                      {data?.image ? (
                        <Image
                          src={data.image?.url || ""}
                          alt="Maqola rasmi"
                          fill
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-full text-muted-foreground flex items-center justify-center h-full">
                          No image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium ">
                    <p className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {data.title}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium ">
                    <p className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {data.description}
                    </p>
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
                        <Link href={`/dashboard/news/${data._id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                        </Link>
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
      {pagination.total > limit && (
        <Pagination>
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
      <DeleteNewsModal
        loading={deleteMutation.isPending}
        onDelete={deleteMutation.mutate}
      />
    </>
  );
};

export default NewsPage;
