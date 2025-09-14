import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, PlusIcon, Search } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      {/* Header with title and add button */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Button disabled>
          <PlusIcon className="mr-2 h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-2 mb-3 w-full justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Sharhlar ichida qidirish..."
            disabled
            className="pl-10"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Reyting" />
            </SelectTrigger>
          </Select>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Javob" />
            </SelectTrigger>
          </Select>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Saralash" />
            </SelectTrigger>
          </Select>
        </div>
      </div>

      {/* Table skeleton */}
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
            {/* Generate 5 skeleton rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* User column */}
                <TableCell>
                  <div className="flex items-center justify-start gap-2">
                    <Avatar>
                      <AvatarFallback>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </AvatarFallback>
                    </Avatar>
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>

                {/* Film column */}
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>

                {/* Rating column */}
                <TableCell className="space-y-2">
                  <div className="grid grid-cols-1 gap-1 items-center">
                    <Badge variant="secondary">
                      <Skeleton className="h-3 w-8" />
                    </Badge>
                    <Skeleton className="h-3 w-12" />
                  </div>
                </TableCell>

                {/* Review text column */}
                <TableCell>
                  <div className="max-w-[250px] space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>

                {/* Reply status column */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>

                {/* Time column */}
                <TableCell>
                  <div className="text-sm space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </TableCell>

                {/* Actions column */}
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                    disabled
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="mt-5 flex justify-end w-full">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-8" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
