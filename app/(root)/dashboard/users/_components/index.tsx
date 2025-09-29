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
import { PlusIcon, Search } from "lucide-react";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";

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

  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading title="Sharhlar" description="" />
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
      </div>
    </>
  );
};

export default UsersMainPage;
