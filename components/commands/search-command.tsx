"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearchCommand } from "@/hooks/use-search-command";
import { sidebarItems } from "@/lib/constants";

const SearchCommand = () => {
  const { open, setOpen } = useSearchCommand();
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Qidirish uchun buyruqni yozing..." />
        <CommandList className="scrollbar-thin">
          <CommandEmpty>Natija topilmadi.</CommandEmpty>
          <CommandGroup heading="Menyu">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.url}
                  onSelect={() => {
                    router.push(item.url);
                    setOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchCommand;
