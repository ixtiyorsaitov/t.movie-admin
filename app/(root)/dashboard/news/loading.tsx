import { Button } from "@/components/ui/button";
import HeadingSkeleton from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical, Search } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full flex justify-center flex-col">
      <HeadingSkeleton />
      <>
        {/* Search and total count skeleton */}
        <div className="flex items-center space-x-2 mb-6 w-full justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Yangiliklar ichida qidirish..."
              className="pl-10"
              disabled
            />
          </div>
          <Button variant="outline" disabled>
            <Skeleton className="h-4 w-16" />
          </Button>
        </div>

        {/* Table skeleton */}
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
              {/* Generate 5 skeleton rows */}
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Image skeleton */}
                  <TableCell className="font-medium">
                    <div className="w-15 h-7 relative">
                      <Skeleton className="w-full h-full rounded" />
                    </div>
                  </TableCell>

                  {/* Title skeleton */}
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>

                  {/* Description skeleton */}
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>

                  {/* Date skeleton */}
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  {/* Published status skeleton */}
                  <TableCell className="font-medium">
                    <Skeleton className="h-6 w-8 rounded-full" />
                  </TableCell>

                  {/* Actions skeleton */}
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-muted rounded-full"
                      disabled
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Amallar menyusi</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination skeleton */}
        <Pagination>
          <PaginationContent>
            {/* Previous button skeleton */}
            <PaginationItem>
              <PaginationPrevious className="cursor-not-allowed opacity-50" />
            </PaginationItem>

            {/* Page numbers skeleton */}
            {Array.from({ length: 3 }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink className="cursor-not-allowed opacity-50">
                  <Skeleton className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next button skeleton */}
            <PaginationItem>
              <PaginationNext className="cursor-not-allowed opacity-50" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    </div>
  );
};

export default Loading;
