"use client";

import { buttonVariants } from "@/components/ui/button";
import { IPrice } from "@/types/price";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PricesUserUI from "./user-ui";
import PriceManagingPanel from "./price-managing-panel";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DeletePriceModal } from "@/components/modals/price-modal";

const PricesPageMain = ({
  datas: defaultDatas,
}: {
  datas: IPrice[];
  limit: number;
}) => {
  const [datas, setDatas] = useState<IPrice[]>(defaultDatas);
  const [viewUserUI, setViewUserUI] = useState<boolean>(
    localStorage.getItem("viewUserUI") === "true" ? true : false
  );
  return (
    <>
      <div className="w-full flex items-center justify-center flex-col px-2">
        <div className="flex items-center justify-between w-full mb-3">
          <Heading
            title={`Narxlar`}
            description="Bozorni narx navolarini boshqarish"
          />
          <div className="grid gap-2 sm:grid-cols-2 grid-cols-1">
            <Select
              onValueChange={(value) => {
                if (value === "ui") {
                  setViewUserUI(true);
                  localStorage.setItem("viewUserUI", "true");
                } else {
                  setViewUserUI(false);
                  localStorage.setItem("viewUserUI", "false");
                }
              }}
              defaultValue={viewUserUI ? "ui" : "table"}
            >
              <SelectTrigger className="max-w-[130px] w-full">
                <SelectValue placeholder="Ko'rinish" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="table">Boshqaruv</SelectItem>
                  <SelectItem value="ui">{"Ko'rinish"}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Link
              href={"/dashboard/prices/create"}
              className={cn(buttonVariants())}
            >
              {"Qo'shish"}
              <PlusIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="px-2">
        {viewUserUI ? (
          <PricesUserUI datas={datas} />
        ) : (
          <PriceManagingPanel datas={datas} />
        )}
      </div>

      <DeletePriceModal setDatas={setDatas} />
    </>
  );
};

export default PricesPageMain;
