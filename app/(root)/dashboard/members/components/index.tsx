"use client";

import { MembersAction } from "@/actions/members";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteMemberModal, useMemberModal } from "@/hooks/use-modals";
import { MemberType, type PaginationType, ROLE } from "@/types";
import type { IMember } from "@/types/member";
import { debounce, set } from "lodash";
import {
  BriefcaseBusinessIcon,
  CopyIcon,
  CrownIcon,
  Edit,
  MoreVertical,
  PlusIcon,
  Search,
  StarIcon,
  Trash2,
  UserIcon,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { TableSkeleton } from "../loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  cn,
  defineMemberType,
  defineMemberTypeIcon,
  getLettersOfName,
  getPageNumbers,
  onCopy,
} from "@/lib/utils";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MemberModal from "@/components/modals/member.modal";
import DeleteMemberModal from "@/components/modals/delete.member.modal";
import { useDeleteMemberMutation } from "@/hooks/useMembers";

interface Props {
  datas: IMember[];
  pagination: PaginationType;
  limit: number;
}

const MembersPageClient = ({
  datas: defaultDatas,
  pagination: defaultPagination,
  limit,
}: Props) => {
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<MemberType | "all">("all");
  const [datas, setDatas] = useState<IMember[]>(defaultDatas);

  const handlePageChange = async (page: number) => {
    setLoading(true);
    const newData = await MembersAction.getAll({
      search: searchTerm,
      page,
      limit,
      typeFilter,
    });
    if (newData.error) {
      toast.error(newData.error);
      return;
    }
    setDatas(newData.datas as IMember[]);
    setPagination(newData.pagination);
    setLoading(false);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setDatas(defaultDatas);
      setPagination(defaultPagination);
      return;
    }
    setLoading(true);
    const newData = await MembersAction.getAll({
      search: e.target.value,
      page: pagination.page,
      limit,
      typeFilter,
    });
    setLoading(false);
    if (newData.error) {
      toast.error(newData.error);
    }
    setDatas(newData.datas as IMember[]);
    setPagination(newData.pagination);
  };

  const handleDebouncedSearch = useCallback(debounce(handleSearch, 300), []);

  useEffect(() => {
    const handleRoleChange = async () => {
      setLoading(true);
      const newData = await MembersAction.getAll({
        search: searchTerm,
        page: pagination.page,
        limit,
        typeFilter,
      });
      if (newData.error) {
        toast.error(newData.error);
      }
      setDatas(newData.datas as IMember[]);
      setPagination(newData.pagination);
      setLoading(false);
    };
    handleRoleChange();
  }, [typeFilter]);

  const modal = useMemberModal();
  const deleteModal = useDeleteMemberModal();

  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading
            title={`Hodimlar (${defaultPagination.total})`}
            description=""
          />
          <Button
            onClick={() => {
              modal.setData(null);
              modal.setOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
          </Button>
        </div>
        <div className="flex items-center space-x-2 mb-3 w-full justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Hodimlar ichidan qidirish..."
              onChange={handleDebouncedSearch}
              className="pl-10"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as MemberType | "all")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha rollar</SelectItem>
                <SelectItem value={MemberType.ACTOR}>OVOZ AKTYORI</SelectItem>
                <SelectItem value={MemberType.TRANSLATOR}>TARJIMON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {loading ? (
          <TableSkeleton limit={limit} />
        ) : (
          <>
            <div className="w-full rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ism</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Tur</TableHead>
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
                        Hech qanday xodim topilmadi
                      </TableCell>
                    </TableRow>
                  ) : (
                    datas.map((data) => (
                      <TableRow
                        key={data._id}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          data.user.role === ROLE.SUPERADMIN && "bg-accent"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center justify-start gap-2 ">
                            <Avatar className="border">
                              <AvatarImage src={data.user.avatar || ""} />
                              <AvatarFallback>
                                {getLettersOfName(data.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{data.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="max-w-[300px] truncate">
                            {data.user.email}
                          </p>
                        </TableCell>
                        <TableCell>
                          {data.user.role === ROLE.USER ? (
                            <div className="flex items-center justify-start gap-1">
                              Oddiy foydalanuvchi{" "}
                              <UserIcon className="h-4 w-4" />
                            </div>
                          ) : data.user.role === ROLE.ADMIN ? (
                            <div className="flex items-center justify-start gap-1">
                              Admin{" "}
                              <StarIcon className="h-4 w-4 fill-primary text-primary" />
                            </div>
                          ) : data.user.role === ROLE.SUPERADMIN ? (
                            <div className="flex items-center justify-start gap-1">
                              Super admin{" "}
                              <CrownIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-start gap-1"></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider delayDuration={200}>
                            <div className="flex items-center justify-start gap-3">
                              {data.type.map((c) => {
                                const Icon = defineMemberTypeIcon(c);
                                const Type = defineMemberType(c);
                                return (
                                  <Tooltip key={c}>
                                    <TooltipTrigger asChild>
                                      <div className="cursor-help p-1 rounded-md hover:bg-muted transition-colors">
                                        <Icon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      {Type}
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          </TooltipProvider>
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
                                    <CopyIcon />
                                    <span className="ml-2">Nusxalash</span>
                                  </DropdownMenuItem>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                      onClick={() => onCopy(data.user._id)}
                                    >
                                      <UserIcon />
                                      User ID
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => onCopy(data._id)}
                                    >
                                      <BriefcaseBusinessIcon />
                                      Hodim ID
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                              <DropdownMenuItem
                                onClick={() => {
                                  modal.setData(data);
                                  modal.setOpen(true);
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
              <Pagination className="mt-5 justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn(
                        "cursor-pointer",
                        pagination.page === 1 &&
                          "pointer-events-none opacity-50"
                      )}
                      onClick={() =>
                        pagination.page > 1 &&
                        handlePageChange(pagination.page - 1)
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers(pagination).map((page, i) =>
                    page === "..." ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <span className="px-2 text-muted-foreground">...</span>
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
                  <PaginationItem>
                    <PaginationNext
                      className={cn(
                        "cursor-pointer",
                        pagination.page >= pagination.totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                      onClick={() =>
                        pagination.page < pagination.totalPages &&
                        handlePageChange(pagination.page + 1)
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      <MemberModal setDatas={setDatas} />
      <DeleteMemberModal setDatas={setDatas} />
    </>
  );
};

export default MembersPageClient;
