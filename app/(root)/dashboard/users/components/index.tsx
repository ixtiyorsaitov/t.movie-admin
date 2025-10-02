"use client";

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
import { useUserModal } from "@/hooks/use-modals";
import { getSearchedUsers } from "@/lib/api/users";
import { IUser, PaginationType, ROLE } from "@/types";
import { debounce } from "lodash";
import {
  CopyIcon,
  Edit,
  FilmIcon,
  MoreVertical,
  PlusIcon,
  Search,
  Star,
  StarIcon,
  Trash2,
  User,
  UserIcon,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CheckMarkIcon from "@/public/icons/checkmark";
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
import { cn, onCopy } from "@/lib/utils";
import { format } from "date-fns";
import UserModal from "@/components/modals/user.modal";

const UsersMainPage = ({
  datas: defaultDatas,
  pagination: defaultPagination,
  limit,
}: {
  datas: IUser[];
  pagination: PaginationType;
  limit: number;
}) => {
  const userModal = useUserModal();
  const [datas, setDatas] = useState<IUser[]>(defaultDatas);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] =
    useState<PaginationType>(defaultPagination);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<ROLE | "all">("all");

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setDatas(defaultDatas);
      setPagination(defaultPagination);
      return;
    }
    const newData = await getSearchedUsers({
      searchTerm: e.target.value,
      page: pagination.page,
      limit,
      roleFilter: roleFilter,
      setLoading,
    });
    if (newData.error) {
      toast.error(newData.error);
    }
    setDatas(newData.datas);
    setPagination(newData.pagination);
  };
  const handleDebouncedSearch = useCallback(debounce(handleSearch, 300), []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading title="Foydalanuvchilar" description="" />
          <Button
            onClick={() => {
              userModal.setData(null);
              userModal.setOpen(true);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> {"Qo'shish"}
          </Button>
        </div>
        <div className="flex items-center space-x-2 mb-3 w-full justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Foydalanuvchilar ichidan qidirish..."
              onChange={handleDebouncedSearch}
              className="pl-10"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as ROLE | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha rollar</SelectItem>
                <SelectItem value={ROLE.USER}>ODDIY FOYDALANUVCHI</SelectItem>
                <SelectItem value={ROLE.MEMBER}>HODIM</SelectItem>
                <SelectItem value={ROLE.ADMIN}>ADMIN</SelectItem>
                <SelectItem value={ROLE.SUPERADMIN} disabled>
                  SUPER ADMIN
                </SelectItem>
              </SelectContent>
            </Select>
            {/* <Select
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
            </Select> */}
          </div>
        </div>
        <div className="w-full rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>{"Qo'shilgan sana"}</TableHead>
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
                    Hech qanday foydalanuvchi topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                datas.map((data) => (
                  <TableRow
                    key={data._id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      data.role === ROLE.SUPERADMIN && "hidden"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center justify-start gap-2 ">
                        <Avatar>
                          <AvatarImage src={data.avatar || ""} />
                          <AvatarFallback>
                            {data.name.slice(0, 2)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{data.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[300px] truncate">{data.email}</p>
                    </TableCell>
                    <TableCell>
                      {data.role === ROLE.USER ? (
                        <div className="flex items-center justify-start gap-1">
                          Oddiy foydalanuvchi <UserIcon className="h-4 w-4" />
                        </div>
                      ) : data.role === ROLE.MEMBER ? (
                        <div className="flex items-center justify-start gap-1">
                          Xodim{" "}
                          <CheckMarkIcon className="fill-primary w-4 h-4" />
                        </div>
                      ) : data.role === ROLE.ADMIN ? (
                        <div className="flex items-center justify-start gap-1">
                          Admin{" "}
                          <StarIcon className="h-4 w-4 fill-primary text-primary" />
                        </div>
                      ) : data.role === ROLE.SUPERADMIN ? (
                        <div className="flex items-center justify-start gap-1">
                          Super admin{" "}
                          <CheckMarkIcon className="fill-primary w-4 h-4" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-start gap-1"></div>
                      )}
                    </TableCell>
                    <TableCell>VIP</TableCell>
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
                                  onClick={() => onCopy(data._id)}
                                >
                                  <UserIcon />
                                  ID
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onCopy(data.name)}
                                >
                                  <Edit />
                                  Ismi
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            onClick={() => {
                              userModal.setData(data);
                              userModal.setOpen(true);
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
                              // deleteModal.setData(data);
                              // deleteModal.setOpen(true);
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
      <UserModal
        setDatas={setDatas}
        setLoading={setLoading}
        loading={loading}
      />
    </>
  );
};

export default UsersMainPage;
