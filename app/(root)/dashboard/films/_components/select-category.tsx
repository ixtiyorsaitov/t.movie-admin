import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useGetAllCategories } from "@/hooks/useCategory";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
}

const SelectCategory = ({ selectedCategory, setSelectedCategory }: Props) => {
  const { data: resp, isLoading } = useGetAllCategories();
  if (!isLoading && resp && resp.error) throw new Error(resp.error);
  return (
    !isLoading && (
      <div>
        <p className="font-semibold text-md mb-2">Kategoriya tanlash</p>
        <Select
          value={selectedCategory}
          onValueChange={(val) => {
            setSelectedCategory(val);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategoriya tanlash" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {resp?.datas.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    )
  );
};

export default SelectCategory;
