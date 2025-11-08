"use client";

import ReviewModal, {
  ReviewDeleteModal,
} from "@/components/modals/review.modal";
import ReviewReplyModal, {
  ReviewDeleteReplyModal,
} from "@/components/modals/review.reply.modal";
import { UserAvatarProfile } from "@/components/shared/user/user-avatar-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useDeleteRepliedReview,
  useDeleteReview,
  useReviewModal,
  useReviewReplyModal,
} from "@/hooks/use-modals";
import { getPageNumbers, onCopy } from "@/lib/utils";
import { PaginationType } from "@/types";
import { IReview } from "@/types/review";
import { format } from "date-fns";
import { debounce } from "lodash";
import {
  CheckCircle,
  Copy,
  DeleteIcon,
  Edit,
  Film,
  MessageCircleIcon,
  MoreVertical,
  PlusIcon,
  Reply,
  Search,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

type ReplyFilterType = "all" | "replied" | "not-replied";
type RatingFilterType = "all" | "high" | "medium" | "low";
type SortByType = "newest" | "oldest" | "popular";

const getSearchedData = async ({
  searchTerm,
  page,
  limit,
  replyFilter,
  ratingFilter,
  sortBy,
  setLoading,
}: {
  searchTerm: string;
  page: number;
  limit: number;
  replyFilter: ReplyFilterType;
  ratingFilter: RatingFilterType;
  sortBy: SortByType;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  try {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/reviews?search=${searchTerm}&page=${page}&limit=${limit}&replyFilter=${replyFilter}&ratingFilter=${ratingFilter}&sortBy=${sortBy}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return {
      error: "Ma'lumotlarni olishda xatolik yuz berdi",
      datas: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  } finally {
    setLoading(false);
  }
};

const ReviewsPageMain = ({
  datas: defaultDatas,
  pagination: defaultPagination,
  limit,
}: {
  datas: IReview[];
  pagination: PaginationType;
  limit: number;
}) => {
  const [datas, setDatas] = useState<IReview[]>(defaultDatas);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replyFilter, setReplyFilter] = useState<ReplyFilterType>("all");
  const [ratingFilter, setRatingFilter] = useState<RatingFilterType>("all");
  const [sortBy, setSortBy] = useState<SortByType>("newest");
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);
  const reviewModal = useReviewModal();
  const reviewReplyModal = useReviewReplyModal();
  const deleteModal = useDeleteReview();
  const deleteReplyModal = useDeleteRepliedReview();

  const handlePageChange = async (page: number) => {
    const newData = await getSearchedData({
      searchTerm,
      page,
      limit,
      replyFilter,
      ratingFilter,
      sortBy,
      setLoading,
    });
    if (newData.error) {
      toast.error(newData.error);
      return;
    }
    setDatas(newData.datas);
    setPagination(newData.pagination);
  };
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setDatas(defaultDatas);
      setPagination(defaultPagination);
      return;
    }
    const newData = await getSearchedData({
      searchTerm: e.target.value,
      page: pagination.page,
      limit,
      replyFilter,
      ratingFilter,
      sortBy,
      setLoading,
    });
    if (newData.error) {
      toast.error(newData.error);
    }
    setDatas(newData.datas);
    setPagination(newData.pagination);
  };
  const handleDebouncedSearch = useCallback(debounce(handleSearch, 300), []);

  useEffect(() => {
    (async () => {
      const newData = await getSearchedData({
        searchTerm,
        page: 1,
        limit,
        replyFilter,
        ratingFilter,
        sortBy,
        setLoading,
      });
      if (newData.error) {
        toast.error(newData.error);
      }
      console.log(newData);

      setDatas(newData.datas);
      setPagination(newData.pagination);
    })();
  }, [replyFilter, ratingFilter, sortBy]);
  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading title="Sharhlar" description="" />
          <Button
            onClick={() => {
              reviewModal.setData(null);
              reviewModal.setOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
          </Button>
        </div>
        <div className="flex items-center space-x-2 mb-3 w-full justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Sharhlar ichida qidirish..."
              onChange={handleDebouncedSearch}
              className="pl-10"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Select
              value={ratingFilter}
              onValueChange={(value) =>
                setRatingFilter(value as RatingFilterType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Reyting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha reytinglar</SelectItem>
                <SelectItem value="high">Yuqori (8-10)</SelectItem>
                <SelectItem value="medium">{"O'rta"} (5-7)</SelectItem>
                <SelectItem value="low">Past (1-4)</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={replyFilter}
              onValueChange={(value) =>
                setReplyFilter(value as ReplyFilterType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Javob" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="replied">Javob berilgan</SelectItem>
                <SelectItem value="not-replied">Javob berilmagan</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortByType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Saralash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Eng yangi</SelectItem>
                <SelectItem value="oldest">Eng eski</SelectItem>
                <SelectItem value="popular">Mashhur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Film</TableHead>
                <TableHead>Reyting</TableHead>
                <TableHead>Fikr</TableHead>
                <TableHead>Javob holati</TableHead>
                <TableHead>Vaqt</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Hech qanday sharh topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                datas.map((data) => (
                  <TableRow
                    key={data._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center justify-start gap-2 ">
                        <Avatar>
                          <AvatarImage src={data.user.avatar || ""} />
                          <AvatarFallback>
                            {data.user.name.slice(0, 2)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{data.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[300px] truncate">
                        {data.film.title}
                      </p>
                    </TableCell>
                    <TableCell className="space-y-2">
                      <div className="grid grid-cols-1 gap-1 items-center">
                        <Badge
                          variant={
                            data.rating >= 8
                              ? "default"
                              : data.rating >= 5
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {data.rating}/10
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {data.rating >= 8
                            ? "Yaxshi"
                            : data.rating >= 5
                            ? "O'rtacha"
                            : "Yomon"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {data?.text?.trim() !== "" ? (
                        <div className="max-w-[250px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="truncate cursor-help">
                                {data.text}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[400px] p-3"
                            >
                              <div className="space-y-2">
                                <p className="font-medium">{"To'liq"} fikr:</p>
                                <p className="text-sm leading-relaxed break-all">
                                  {data.text}
                                </p>
                                <div className="text-xs border-t pt-2">
                                  {data.text?.length} belgi •{" "}
                                  {format(
                                    new Date(data.createdAt),
                                    "dd.MM.yyyy HH:mm"
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-xs text-muted-foreground">
                            {data.text?.length} belgi
                          </span>
                        </div>
                      ) : (
                        <span className="text-destructive text-sm">
                          Fikr {"yo'q"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {data.reply ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">
                              Javob berilgan
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="text-sm text-destructive">
                              Javob {"yo'q"}
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {format(new Date(data.createdAt), "dd.MM.yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(data.createdAt), "HH:mm")}
                        </div>
                      </div>
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
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger asChild>
                              <DropdownMenuItem>
                                <Copy />
                                <span className="ml-2">Nusxalash</span>
                              </DropdownMenuItem>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() => onCopy(data.user._id)}
                                >
                                  <User />
                                  Foydalanuvchi ID
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onCopy(data.film._id)}
                                >
                                  <Film />
                                  Film ID
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (data?.text?.trim() !== "") {
                                      onCopy(data.text as string);
                                    } else {
                                      toast.error("Fikr yo'q");
                                    }
                                  }}
                                >
                                  <MessageCircleIcon />
                                  Fikrni
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            onClick={() => {
                              reviewModal.setData(data);
                              reviewModal.setOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          {data.reply ? (
                            <DropdownMenuItem
                              onClick={() => {
                                reviewReplyModal.setData(data);
                                reviewReplyModal.setOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Reply className="mr-2 h-4 w-4" />
                              Javobni tahrirlash
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                reviewReplyModal.setData(data);
                                reviewReplyModal.setOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Reply className="mr-2 h-4 w-4" />
                              Javob berish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {data.reply && (
                            <DropdownMenuItem
                              onClick={() => {
                                deleteReplyModal.setData(data);
                                deleteReplyModal.setOpen(true);
                              }}
                              variant="destructive"
                              className="cursor-pointer"
                            >
                              <DeleteIcon className="mr-2 h-4 w-4" />
                              Javobni {"o'chirish"}
                            </DropdownMenuItem>
                          )}
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
          <Pagination className="mt-5 justify-end">
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
      <ReviewModal setDatas={setDatas} />
      <ReviewDeleteModal setList={setDatas} />
      <ReviewReplyModal setList={setDatas} />
      <ReviewDeleteReplyModal setList={setDatas} />
    </>
  );
};

export default ReviewsPageMain;
