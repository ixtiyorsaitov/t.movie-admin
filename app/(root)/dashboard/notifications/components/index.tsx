"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useDeleteNotificationModal } from "@/hooks/use-modals";
import { cn, defineNotificationType } from "@/lib/utils";
import { PaginationType } from "@/types";
import { INotification } from "@/types/notification";
import { format } from "date-fns";
import { Edit, MoreVertical, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  datas: INotification[];
  limit: number;
  pagination: PaginationType;
}

const NotificationsPageMain = ({ datas, limit, pagination }: Props) => {
  const deleteModal = useDeleteNotificationModal();
  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading
            title={`Bildirishnomalar`}
            description="Bildirishnomalarni boshqarish va yaratish"
          />
          <Link
            href={"/dashboard/notifications/create"}
            className={cn(buttonVariants())}
          >
            {"Qo'shish"}
            <PlusIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="px-2">
        <div className="w-full rounded-lg border bg-card">
          <Table className="w-full overflow-x-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Tur</TableHead>
                <TableHead>Sarlavha</TableHead>
                <TableHead>{"Ko'rishlar"}</TableHead>
                <TableHead>Vaqti</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Hech qanday {"bildirishnoma"} topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                datas.map((data) => (
                  <TableRow key={data._id}>
                    <TableCell className="font-medium">
                      {defineNotificationType(data.type)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 justify-start">
                              <p className="truncate cursor-help">
                                {data.title}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="max-w-[400px] p-3"
                          >
                            <div className="space-y-2">
                              <p className="text-sm max-h-[200px] overflow-auto scrollbar-thin scrollbar-track-white/50 scrollbar-thumb-primary leading-relaxed break-all">
                                {data.title}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>{data.isReadBy}</TableCell>
                    <TableCell>
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
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/dashboard/notifications/${data._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Tahrirlash
                            </Link>
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
      </div>
    </>
  );
};

export default NotificationsPageMain;
