"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteNotificationModal } from "@/hooks/use-modals";
import {
  cn,
  defineNotificationIcon,
  defineNotificationSendingType,
  defineNotificationType,
  onCopy,
} from "@/lib/utils";
import type { PaginationType } from "@/types";
import type { INotification } from "@/types/notification";
import { format } from "date-fns";
import {
  BellRing,
  CopyIcon,
  Edit,
  EyeIcon,
  FilmIcon,
  KeyIcon,
  MessageCircleIcon,
  MoreVertical,
  PlusIcon,
  SendIcon,
  StarIcon,
  Trash2,
  TvIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

interface Props {
  datas: INotification[];
  limit: number;
  pagination: PaginationType;
}

const NotificationsPageMain = ({ datas, limit, pagination }: Props) => {
  const deleteModal = useDeleteNotificationModal();
  return (
    <TooltipProvider delayDuration={0}>
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
            <PlusIcon className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
      <div className="px-2">
        <div className="w-full rounded-lg border bg-card shadow-sm">
          <Table className="w-full overflow-x-auto">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[150px]">Tur</TableHead>
                <TableHead className="min-w-[200px]">Sarlavha</TableHead>
                <TableHead className="w-[100px] text-center">
                  {"Jo'natilish turi"}
                </TableHead>
                <TableHead className="w-[150px] text-right">Vaqti</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Hech qanday {"bildirishnoma"} topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                datas.map((data) => {
                  const Icon = defineNotificationIcon(data.type);
                  const type = defineNotificationType(data.type);
                  return (
                    <TableRow key={data._id} className="group">
                      <TableCell className="font-medium">
                        <Badge
                          variant="secondary"
                          className="gap-1.5 py-1 px-2.5"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-help space-y-1">
                                <p className="truncate font-medium text-foreground">
                                  {data.title}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {data.message}
                                </p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              align="center"
                              className="max-w-[320px] p-0 border-border/50 shadow-xl"
                            >
                              <div className="bg-muted/50 p-3 border-b border-border/50">
                                <h4 className="font-semibold text-sm text-white">
                                  {data.title}
                                </h4>
                              </div>
                              <div className="p-3 bg-card">
                                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                                  {data.message}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center gap-1.5 cursor-help py-1 px-2 rounded-md hover:bg-muted/50 transition-colors w-fit mx-auto">
                              <EyeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-medium text-sm">
                                {data.stats.totalRead}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            className="p-0 border-border/50 shadow-xl min-w-[180px]"
                          >
                            <div className="p-2 space-y-1">
                              <div className="flex items-center justify-between text-xs p-1.5 hover:bg-muted/50 rounded-sm">
                                <div className="flex items-center gap-2">
                                  <SendIcon className="w-3 h-3" />
                                  <span>Yuborilgan</span>
                                </div>
                                <span className="font-medium font-mono text-lg">
                                  {data.stats.totalSent}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs p-1.5 hover:bg-muted/50 rounded-sm">
                                <div className="flex items-center gap-2">
                                  <EyeIcon className="w-3 h-3" />
                                  <span>{"O'qilgan"}</span>
                                </div>
                                <span className="font-medium font-mono text-lg">
                                  {data.stats.totalRead}
                                </span>
                              </div>
                              <Separator className="my-1" />
                              <div className="flex items-center justify-between text-xs p-1.5 bg-muted/30 rounded-sm">
                                <span className="font-medium">
                                  Samaradorlik
                                </span>
                                <span className="font-bold font-mono text-lg">
                                  {data.stats.readPercentage}%
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip> */}
                        <Badge>
                          {defineNotificationSendingType(data.sending.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        <p className="text-xs">
                          {format(new Date(data.createdAt), "HH:mm")}
                        </p>
                        <p>{format(new Date(data.createdAt), "dd.MM.yyyy")}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Amallar menyusi</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[200px]"
                          >
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <CopyIcon className="w-4 h-4 mr-2" />
                                <span>Nusxalash</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {!data.isGlobal && data.user && (
                                    <DropdownMenuItem
                                      onClick={() => onCopy(data.user!._id)}
                                    >
                                      <UserIcon />
                                      Foydalanuvchi ID
                                    </DropdownMenuItem>
                                  )}
                                  {data.film && (
                                    <DropdownMenuItem
                                      onClick={() => onCopy(data.film!._id)}
                                    >
                                      <FilmIcon />
                                      Film ID
                                    </DropdownMenuItem>
                                  )}
                                  {data.episode && (
                                    <DropdownMenuItem
                                      onClick={() => onCopy(data.episode!._id)}
                                    >
                                      <TvIcon />
                                      Epizod ID
                                    </DropdownMenuItem>
                                  )}
                                  {data.commentReply && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        onCopy(data.commentReply!._id)
                                      }
                                    >
                                      <MessageCircleIcon />
                                      Izoh ID
                                    </DropdownMenuItem>
                                  )}

                                  {data.reviewReply && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        onCopy(data.reviewReply!._id)
                                      }
                                    >
                                      <StarIcon />
                                      Sharhga ID
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => onCopy(data._id)}
                                  >
                                    <BellRing />
                                    Bildirishnoma ID
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer"
                            >
                              <Link
                                href={`/dashboard/notifications/${data._id}`}
                              >
                                <Edit className="h-4 w-4" />
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
                              <Trash2 className="h-4 w-4" />
                              {"O'chirish"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NotificationsPageMain;
