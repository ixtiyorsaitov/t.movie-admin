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
import { PaginationType } from "@/types";
import { IReview } from "@/types/review";
import { format } from "date-fns";
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
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ReviewsPageMain = ({
  datas: defaultDatas,
  pagination: defaultPagination,
}: {
  datas: IReview[];
  pagination: PaginationType;
}) => {
  const [datas, setDatas] = useState<IReview[]>(defaultDatas);
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);
  const reviewModal = useReviewModal();
  const reviewReplyModal = useReviewReplyModal();
  const deleteModal = useDeleteReview();
  const deleteReplyModal = useDeleteRepliedReview();
  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Nusxalandi");
  };
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
        <div className="w-full rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Film</TableHead>
                <TableHead>Reyting</TableHead>
                <TableHead>Fikr</TableHead>
                <TableHead>Vaqt</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
      </div>
      <ReviewModal setDatas={setDatas} />
      <ReviewDeleteModal setList={setDatas} />
      <ReviewReplyModal setList={setDatas} />
      <ReviewDeleteReplyModal setList={setDatas} />
    </>
  );
};

export default ReviewsPageMain;
