import HeadingSkeleton from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Loading = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col px-2">
      <HeadingSkeleton />
      <SearchFilterSkeleton />
      <TableSkeleton limit={10} />
      <PaginationSkeleton />
    </div>
  );
};

export default Loading;

export function SearchFilterSkeleton() {
  return (
    <div className="flex items-center space-x-2 mb-3 w-full justify-between">
      <div className="relative flex-1 max-w-sm">
        <Skeleton className="h-10 w-full rounded" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-10 w-40 rounded" />
      </div>
    </div>
  );
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-end gap-2 mt-5">
      <Skeleton className="h-10 w-10 rounded" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-10 rounded" />
      ))}
      <Skeleton className="h-10 w-10 rounded" />
    </div>
  );
}

export function TableSkeleton({ limit = 5 }: { limit: number }) {
  return (
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
          {Array.from({ length: limit }).map((_, index) => (
            <TableRow key={index}>
              {/* Name column with avatar skeleton */}
              <TableCell>
                <div className="flex items-center justify-start gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </TableCell>
              {/* Email column */}
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>
              {/* Role column */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              {/* Type column with multiple icons */}
              <TableCell>
                <div className="flex items-center justify-start gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </TableCell>
              {/* Actions column */}
              <TableCell className="text-center">
                <Skeleton className="h-8 w-8 rounded-full ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
