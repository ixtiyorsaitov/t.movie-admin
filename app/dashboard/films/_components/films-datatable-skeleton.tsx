import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FilmDataTableSkeleton = () => {
  return (
    <div className="w-full">
      {/* Filter and column controls skeleton */}
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[100px] ml-auto" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[60px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[60px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[80px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[50px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                {/* Title */}
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                {/* Type */}
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                {/* Rating */}
                <TableCell>
                  <div className="flex items-center gap-2 ml-4">
                    <Skeleton className="h-4 w-[30px]" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Skeleton
                          key={starIndex}
                          className="h-4 w-4 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </TableCell>
                {/* Likes */}
                <TableCell>
                  <Skeleton className="h-4 w-[40px]" />
                </TableCell>
                {/* Published */}
                <TableCell>
                  <Skeleton className="h-4 w-[30px]" />
                </TableCell>
                {/* Genres */}
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1">
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-x-2 flex">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[60px]" />
        </div>
      </div>
    </div>
  );
};

export default FilmDataTableSkeleton;
