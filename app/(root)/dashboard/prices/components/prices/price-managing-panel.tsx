import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useDeletePriceModal } from "@/hooks/use-modals";
import { PeriodType } from "@/types";
import { IPrice } from "@/types/price";
import { format } from "date-fns";
import { CheckIcon, Edit, MoreVertical, Trash2, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const PriceManagingPanel = ({ datas }: { datas: IPrice[] }) => {
  const deletePrice = useDeletePriceModal();

  return (
    <div className="w-full rounded-lg border bg-card">
      <Table className="w-full overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Nomi</TableHead>
            <TableHead>Tarif</TableHead>
            <TableHead>Narxi</TableHead>
            <TableHead>Vaqti</TableHead>
            <TableHead>Xususiyatlari</TableHead>
            <TableHead>{"Qo'shilgan sana"}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {datas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                Hech qanday {"ta'rif"} topilmadi
              </TableCell>
            </TableRow>
          ) : (
            datas.map((price) => (
              <TableRow key={price._id}>
                <TableCell className="font-medium">{price.name}</TableCell>
                <TableCell>
                  <div className="max-w-[250px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 justify-start">
                          <p className="truncate cursor-help">
                            {price.description}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[400px] p-3">
                        <div className="space-y-2">
                          <p className="text-sm max-h-[200px] overflow-auto scrollbar-thin scrollbar-track-white/50 scrollbar-thumb-primary leading-relaxed break-all">
                            {price.description}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  {price.price} {"so'm"}
                </TableCell>
                <TableCell>
                  {`${price.expiresPeriodCount} ${
                    price.period === PeriodType.MONTHLY ? "oylik" : "yillik"
                  }`}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center justify-start">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex gap-1 items-center justify-center">
                          <CheckIcon className="w-5 h-5 text-green-500" />{" "}
                          {price.features.filter((f) => f.included).length}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[400px] p-3">
                        <div className="space-y-2 text-sm max-h-[200px] overflow-auto scrollbar-thin scrollbar-track-white/50 scrollbar-thumb-primary leading-relaxed break-all">
                          {price.features
                            .filter((f) => f.included)
                            .map((f) => (
                              <p key={f.text}>{f.text}</p>
                            ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex gap-1 items-center justify-center">
                          <XIcon className="w-5 h-5 text-destructive" />
                          {price.features.filter((f) => !f.included).length}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[400px] p-3">
                        <div className="space-y-2 text-sm max-h-[200px] overflow-auto scrollbar-thin scrollbar-track-white/50 scrollbar-thumb-primary leading-relaxed break-all">
                          {price.features
                            .filter((f) => !f.included)
                            .map((f) => (
                              <p key={f.text}>{f.text}</p>
                            ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(price.createdAt), "dd.MM.yyyy")}
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
                        <Link href={`/dashboard/prices/${price._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Tahrirlash
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => {
                          deletePrice.setData(price);
                          deletePrice.setOpen(true);
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
  );
};

export default PriceManagingPanel;
