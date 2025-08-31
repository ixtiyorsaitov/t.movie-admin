"use client";

import ReviewModal from "@/components/modals/review.modal";
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
import { useReviewModal } from "@/hooks/use-modals";
import { PaginationType } from "@/types";
import { IReview } from "@/types/review";
import { format } from "date-fns";
import {
  ChevronLeftIcon,
  Copy,
  Edit,
  Film,
  MessageCircleIcon,
  MoreVertical,
  PlusIcon,
  Reply,
  Trash2,
  User,
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
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {data?.text?.trim() !== "" ? (
                        <p className="max-w-[300px] truncate">{data.text}</p>
                      ) : (
                        <span className="text-destructive">{"Fikr yo'q"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(data.createdAt), "HH:mm | dd.MM.yyyy")}
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
                          <DropdownMenuItem
                            onClick={() => {
                              reviewModal.setData(data);
                              reviewModal.setOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Reply className="mr-2 h-4 w-4" />
                            Javob berish
                          </DropdownMenuItem>
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
      </div>
      <ReviewModal setDatas={setDatas} />
    </>
  );
};

export default ReviewsPageMain;
