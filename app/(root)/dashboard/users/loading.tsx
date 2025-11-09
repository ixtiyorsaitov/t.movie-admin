import HeadingSkeleton from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const Loading = () => {
  return (
    <div className="w-full">
      <HeadingSkeleton />
      <TableSkeleton />
    </div>
  );
};

export default Loading;

export const TableSkeleton = ({ limit = 10 }: { limit?: number }) => {
  return (
    <>
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
            {Array.from({ length: limit }).map((_, i) => (
              <TableRow key={i}>
                {/* Name with avatar skeleton */}
                <TableCell>
                  <div className="flex items-center justify-start gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>

                {/* Email skeleton */}
                <TableCell>
                  <Skeleton className="h-4 w-64" />
                </TableCell>

                {/* Role skeleton */}
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>

                {/* Status skeleton */}
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>

                {/* Date skeleton */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Action menu skeleton */}
                <TableCell className="text-center">
                  <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
